const escpos = require('escpos');

class PrintUtils {
    /**
     * 加載圖片
     * @param {string} imagePath 圖片路徑
     * @returns {Promise<escpos.Image>}
     */
    static loadImage(imagePath) {
        return new Promise((resolve) => {
            escpos.Image.load(imagePath, (image) => {
                resolve(image);
            });
        });
    }

    /**
     * 列印圖片
     * @param {Object} device 列印機裝置
     * @param {string} imagePath 圖片路徑
     * @returns {Promise<void>}
     */
    static async printImage(device, imagePath) {
        try {
            const image = await this.loadImage(imagePath);
            const printer = new escpos.Printer(device);

            printer.raster(image);
            printer.cut();
            printer.close();
            console.log("✅ 圖片打印成功");
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
}

module.exports = PrintUtils;
