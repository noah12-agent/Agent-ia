const fs = require("fs");
const path = require("path");

const defaultPath = path.join(__dirname, "..", "..", "storage", "reservations.json");

const getFilePath = () => {
  return process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : defaultPath;
};

const ensureFile = () => {
  const filePath = getFilePath();
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ reservations: [] }, null, 2));
  }

  return filePath;
};

const readData = () => {
  const filePath = ensureFile();
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

const writeData = (data) => {
  const filePath = ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
  readData,
  writeData
};
