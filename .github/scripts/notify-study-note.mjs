import { execFileSync } from "node:child_process";

const {
  BEFORE_SHA: beforeSha,
  AFTER_SHA: afterSha,
  DISCORD_WEBHOOK_URL: webhookUrl,
  GITHUB_REPOSITORY: repository,
  GITHUB_SERVER_URL: serverUrl = "https://github.com",
} = process.env;

if (!beforeSha || !afterSha || !repository) {
  throw new Error("GitHub push context is incomplete.");
}

const git = (args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });

const addedFiles = /^0+$/.test(beforeSha)
  ? git([
      "diff-tree",
      "--root",
      "--no-commit-id",
      "--name-only",
      "--diff-filter=A",
      "-r",
      "-z",
      afterSha,
    ])
  : git([
      "diff",
      "--name-only",
      "--diff-filter=A",
      "-z",
      beforeSha,
      afterSha,
    ]);

const submissionsByWeek = new Map();

for (const path of addedFiles.split("\0").filter(Boolean)) {
  const match = path.match(/^w(\d{2})-(.+)\/학습노트\/([^/]+)\.md$/u);

  if (!match) continue;

  const [, weekText, topicSlug, submitter] = match;
  if (submitter.toLowerCase() === "readme") continue;

  const week = Number.parseInt(weekText, 10);
  const topic = topicSlug.replaceAll("-", " ");
  const submission = submissionsByWeek.get(week) ?? {
    topic,
    submitters: new Set(),
    files: [],
  };

  submission.submitters.add(submitter);
  submission.files.push({ path, submitter });
  submissionsByWeek.set(week, submission);
}

if (submissionsByWeek.size === 0) {
  console.log("No newly added study notes; notification skipped.");
  process.exit(0);
}

if (!webhookUrl) {
  throw new Error("DISCORD_WEBHOOK_URL repository secret is not configured.");
}

const escapeMarkdown = (text) => text.replace(/([\\`*_{}\[\]()<>#+\-.!|])/g, "\\$1");
const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");
const commitUrl = `${serverUrl}/${repository}/commit/${afterSha}`;

const submissions = [...submissionsByWeek.entries()]
  .sort(([left], [right]) => left - right)
  .map(([week, submission]) => ({
    week,
    topic: submission.topic,
    submitters: [...submission.submitters].sort((left, right) =>
      left.localeCompare(right, "ko"),
    ),
    files: submission.files.sort((left, right) =>
      left.submitter.localeCompare(right.submitter, "ko"),
    ),
  }));

const payload = {
  username: "시스템 설계 스터디",
  content: submissions
    .map(
      ({ week, submitters }) =>
        `✅ **${week}주차 ${submitters.map(escapeMarkdown).join(" · ")} 과제 제출 완료!**`,
    )
    .join("\n"),
  embeds: submissions.map(({ week, topic, files }) => ({
    color: 0x57f287,
    title: `📚 ${week}주차 · ${topic}`,
    url: commitUrl,
    fields: [
      {
        name: "제출 파일",
        value: files
          .map(
            ({ path, submitter }) =>
              `[${escapeMarkdown(submitter)}\.md](${serverUrl}/${repository}/blob/${afterSha}/${encodePath(path)})`,
          )
          .join("\n"),
      },
    ],
    footer: {
      text: "멋쟁이사자처럼 경희대학교 백엔드",
    },
  })),
  allowed_mentions: {
    parse: [],
  },
};

const endpoint = new URL(webhookUrl);
endpoint.searchParams.set("wait", "true");

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const responseBody = (await response.text()).slice(0, 500);
  throw new Error(`Discord webhook failed (${response.status}): ${responseBody}`);
}

console.log(
  `Discord notified for ${submissions.reduce((count, item) => count + item.files.length, 0)} submission(s).`,
);
