import fs from "node:fs";
import path from "node:path";

/** Prints route x viewport results and writes test-results/matrix-summary.json. */
export default class MatrixReporter {
  constructor() {
    this.rows = [];
    this.skipped = [];
  }

  onTestEnd(test, result) {
    const attachment = result.attachments.find((a) => a.name === "matrix" && a.body);
    if (attachment) this.rows.push(JSON.parse(attachment.body.toString()));
    else if (result.status === "skipped" && test.parent?.title === "admin routes x viewports") {
      this.skipped.push({ route: test.title, reason: test.annotations.find((a) => a.type === "skip")?.description || "" });
    }
  }

  onEnd() {
    if (!this.rows.length) return;
    const byViewport = {};
    for (const row of this.rows) {
      for (const { viewport, issues } of row.results) {
        const bucket = (byViewport[viewport] ||= { pass: 0, fail: 0, failures: [] });
        if (issues.length) {
          bucket.fail += 1;
          bucket.failures.push({ url: row.url, issues });
        } else bucket.pass += 1;
      }
    }
    const summary = { routes: this.rows.length, skipped: this.skipped, byViewport };
    const file = path.resolve("test-results/matrix-summary.json");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(summary, null, 2));

    console.log(`\nRoute matrix: ${this.rows.length} routes tested, ${this.skipped.length} skipped`);
    for (const [viewport, b] of Object.entries(byViewport)) console.log(`  ${viewport.padStart(4)}px  pass ${b.pass}  fail ${b.fail}`);
    for (const s of this.skipped) console.log(`  skipped ${s.route}: ${s.reason}`);
    console.log(`Details: ${path.relative(process.cwd(), file)}\n`);
  }
}
