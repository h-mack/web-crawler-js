function printReport(pages) {
  console.log("Report starting...");
  let sortable = [];
  for (let item in pages) {
    sortable.push([item, pages[item]]);
  }
  sortable.sort((a, b) => {
    return b[1] - a[1];
  });

  for (let item in sortable) {
    console.log(
      `Found ${sortable[item][1]} internal links to ${sortable[item][0]}`
    );
  }
}

module.exports = { printReport };
