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
const generatedSection = `${startMarker}\n${table}\n${endMarker}`;
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
