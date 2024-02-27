const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }
  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }
  if (currentURL === baseURL) {
    pages[normalizedURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }
  console.log(`crawling ${currentURL}`);
  let htmlBody = "";
  try {
    const resp = await fetch(currentURL);
    if (resp.status > 399) {
      console.error(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(`Got non-html response: ${contentType}`);
      return pages;
    }
    htmlBody = await resp.text();
  } catch (err) {
    console.error(err.message);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const el of aElements) {
    if (el.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(el.href, baseURL).href);
      } catch (err) {
        console.error(`${err.message}: ${el.href}`);
      }
    } else {
      try {
        urls.push(new URL(el.href).href);
      } catch (err) {
        console.error(`${err.message}: ${el.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

module.exports = { crawlPage, normalizeURL, getURLsFromHTML };
