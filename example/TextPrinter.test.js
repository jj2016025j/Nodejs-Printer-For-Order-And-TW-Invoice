const TextPrinter = require("../core/TextPrinter")

const printer = new TextPrinter();
printer.printTestSections({});
printer.printTestSections({
  cut: true,
  text: { content: "TextPrinter text", fontSize: 0 },
  barcode: { content: "TextPrinter barcode", type: "CODE39", width: 10, height: 30 },
  alignment: { align: 'ct' },
  table: true
});
