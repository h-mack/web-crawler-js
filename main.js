const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
  }
  if (process.argv.length > 3) {
    console.log("too many arguments provided");
  }

  const baseURL = process.argv[2];

  console.log(`starting crawl of: ${baseURL}...`);

  const pages = await crawlPage(baseURL, baseURL, {});

  printReport(pages);
}

main();

/**
 * Future ideas:
 *
 * Make the script run on a timer and deploy it to a server. Have it email you every so often with a report.
 * Add more robust error handling so that you can crawl larger sites without issues.
 * Count external links, as well as internal links, and add them to the report.
 * Save the report as a CSV spreadsheet rather than printing it to the console.
 * Use a graphics library to create an image that shows the links between the pages as a graph visualisation.
 * Make requests concurrently to speed up the crawling process.
 */
