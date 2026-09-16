import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const members = [
  "김우진",
  "노희윤",
  "박세인",
  "박현아",
  "신선우",
  "심아현",
  "안시현",
  "윤선재",
  "임근엽",
  "장찬욱",
  "한예진",
];
const presenters = new Map([
  [1, "신선우"],
  [2, "심아현"],
  [3, "한예진"],
  [4, "안시현"],
  [5, "윤선재"],
  [6, "임근엽"],
  [7, "박세인"],
  [8, "박현아"],
  [9, "노희윤"],
]);

const firstWeek = 1;
const lastWeek = 9;
const startMarker = "<!-- submission-status:start -->";
const endMarker = "<!-- submission-status:end -->";
const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const readmePath = join(repositoryRoot, "README.md");

const weekDirectories = new Map(
  readdirSync(repositoryRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const match = entry.name.match(/^w(\d{2})-/u);
      return match ? [Number.parseInt(match[1], 10), entry.name] : null;
    })
    .filter(Boolean),
);

const weeks = Array.from(
  { length: lastWeek - firstWeek + 1 },
  (_, index) => firstWeek + index,
);

for (const week of weeks) {
  if (!weekDirectories.has(week)) {
    throw new Error(`Week ${week} directory was not found.`);
  }
}

const header = ["이름", ...weeks.map((week) => `${week}주차`)];
const separator = header.map(() => "---");
const rows = members.map((member) => [
  member,
  ...weeks.map((week) => {
    if (presenters.get(week) === member) return "*발제*";

    const directory = weekDirectories.get(week);
    const notesDirectory = join(repositoryRoot, directory, "학습노트");
    const expectedFilename = `${member}.md`.normalize("NFC");
    const actualFilename = readdirSync(notesDirectory).find(
      (filename) => filename.normalize("NFC") === expectedFilename,
    );

    if (!actualFilename) return "-";

    const notePath = join(notesDirectory, actualFilename);
    const sourcePath = relative(repositoryRoot, notePath).split("/").join("/");
    return `[제출](./${sourcePath})`;
  }),
]);

const table = [header, separator, ...rows]
  .map((row) => `| ${row.join(" | ")} |`)
  .join("\n");
const updatedAt = process.env.SUBMISSION_STATUS_UPDATED_AT
  ? new Date(process.env.SUBMISSION_STATUS_UPDATED_AT)
  : new Date();

if (Number.isNaN(updatedAt.getTime())) {
  throw new Error("SUBMISSION_STATUS_UPDATED_AT must be a valid date.");
}

const updatedAtParts = Object.fromEntries(
  new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(updatedAt)
    .map(({ type, value }) => [type, value]),
);
const lastUpdated = `*최근 업데이트: ${updatedAtParts.year}.${updatedAtParts.month}.${updatedAtParts.day} ${updatedAtParts.hour}:${updatedAtParts.minute}*`;
const generatedSection = `${startMarker}\n${table}\n\n${lastUpdated}\n${endMarker}`;
const readme = readFileSync(readmePath, "utf8");
const markerPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, "u");

if (!markerPattern.test(readme)) {
  throw new Error("Submission status markers were not found in README.md.");
}

const updatedReadme = readme.replace(markerPattern, generatedSection);

if (updatedReadme === readme) {
  console.log("Submission status is already up to date.");
  process.exit(0);
}

writeFileSync(readmePath, updatedReadme);
console.log("Submission status was updated.");
