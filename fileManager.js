const fs = require("fs/promises");

async function createFileIfNotExists(filePath = "tasks.txt", headers="title|created_at|deadline|status") {
  try {
    await fs.access(filePath, fs.constants.R_OK);
  } catch (e) {
    if (e.code === "ENOENT") {
      await fs.writeFile(filePath, headers);
    } else {
      console.log("Error occurred in createFileIfNotExists:", e);
    }
  }
}
async function readFile(filePath = "tasks.txt") {
  try {
    const selected = await fs.readFile(filePath);
    return selected.toString().split("\n");
  } catch (e) {
    console.log(`Error occurred in readFile:`, e);
  }
}
 function writeContent(content = "buy a new house|2024.11.05|2025.02.02|created ",filePath = "tasks.txt") {
  try {
 fs.appendFile(filePath, `${content}\n`, "utf8");
  } catch (e) {
    console.log(`Error occurred in writeContent:`, e);
  }
}

async function updateContent(row, content,filePath = "tasks.txt") {
  try {
    if (!(content.length && row)) {
      console.log(`You have to give a content to update existing content`);
      return 0;
    }

    const selected = await readFile(filePath);
    selected[row] = content.join("|");
    const updatedContent = selected.join("\n");
    await fs.writeFile(filePath, updatedContent);
  } catch (e) {
    console.log(`Error occurred in updateContent:`, e);
  }
}

async function deleteContent(row, filePath = "tasks.txt") {
  try {
    if (!row) {
      console.log(`You have to give row number`);
      return;
    }
    const selected = await readFile(filePath);
    if (selected.length < row) {
      console.log(`There is no such as element`);
      return;
    }
    const deletedContent = selected.filter((value, index) => index !== row);
    await fs.writeFile(filePath, deletedContent.join("\n"), "utf8");
  } catch (e) {
    console.log(`Error occurred in deleteContent:`, e);
  }
}

module.exports = {
  readFile,
  updateContent,
  deleteContent,
  writeContent,
  createFileIfNotExists
};
