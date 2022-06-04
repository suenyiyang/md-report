# md-report

## What's `md-report`

The repo name `md-report` stands for both "Write your reports in markdown, and get them in docx." and "Made report again." ("马德，又是报告" in Chinese) meanings.

## Motivation

Anyway, it is quite inconvenient for Mac OS / Linux users to deal with MS Office files (sometimes it's the same for Windows users because of the outdated doc template).

Writing characters, words and sentences is easy, but it is difficult to handle style in WPS Office as well as MS Office.

## Benifit

The md-report helps you focus on the content rather than the style of your reports.

## Basic Usage

### Install Node.js v14+

Just follow the [instruction on the official website](https://nodejs.org/en/download) to download and install Node.js.

> For frontend developers, [nvm](https://github.com/nvm-sh/nvm) is a better choice.

### Create Workspace Directory

Create a folder that will contain your work of report and create a markdown file named `index.md` in the folder.

Also create a `config.json` file to set the text in page headers.

- `index.md`: Choose a template in (https://github.com/syy11cn/md-report/tree/main/templates) or write your own structure of reports.
- `config.json`: Write the config file as follows (Remember to replace `<your_page_header_text>` with your own text). More configuration support and docs are on the way.

```json
{
  "meta": {
    "pageHeaderText": "<your_page_header_text>" // Will be placed in page header on even pages.
  }
}
```

### Run the Command

- With `npx`:

```bash
cd <your_workspace_dir>
npx @md-report/core
```

- Install the command globally:

```bash
npm i -g @md-report/core
cd <your_workspace_dir>
mdreport
```

By default, a `My Document.docx` file will be created in your workspace directory.

### Custom Input and Output

- To specify the input markdown file, use `-f` argument;
- To specify the input config file, use `-c` argument;
- To specify the filename of output document, use `-o` argument.

### One More Step

Because of the limit of dependency, the TOC is inserted but need to be manually updated.

- After you get your `.docx` document, just open it, and check if there is any mistakes.
- Then go to the first line on the first page.
- Click the right button of your mouse, and select the `update field` item in the menu.

Finally, you just need to combine your cover and your contents together. It's just a combination of two `.docx` files. You can find tons of utils and get your taste to solve it.

## Acknowledgement

The idea comes from [slidev](https://github.com/slidevjs/slidev), a PowerPoint generator with markdown files.

## License

MIT &copy; 2022 Yiyang Sun
