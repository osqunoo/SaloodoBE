const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const pdf = require('html-pdf');

module.exports = {
	createPDF: function (data, templateName, res) {

		var templateHtml = fs.readFileSync(path.resolve(__dirname, `../reportTemplates/${templateName}`)).toString('utf8');
		var template = handlebars.compile(templateHtml);
		var bitmap = fs.readFileSync(path.resolve(__dirname, '../assets/images/logoSSC.svg')).toString('utf8');
		//var image = new Buffer(bitmap).toString('base64');
		var image = Buffer.from(bitmap).toString('base64');
		data[0].CF_image = image;
		var html = template(data[0]);

		pdf.create(html, {
			quality: "20",
			timeout: '9999999',
			orientation: "landscape"
		}).toStream(function (err, stream) {
			stream.pipe(res);
		});

		var milis = new Date();
		milis = milis.getTime();

		// var pdfPath = path.join('pdf', `clearanceTemplate-${milis}.pdf`);

		// var options = {
		// 	width: '1230px',
		// 	headerTemplate: "<p></p>",
		// 	footerTemplate: "<p></p>",
		// 	displayHeaderFooter: false,
		// 	margin: {
		// 		top: "10px",
		// 		bottom: "30px"
		// 	},
		// 	printBackground: true,
		// 	path: pdfPath
		// }

		// const browser = await puppeteer.launch({
		// 	args: ['--no-sandbox'],
		// 	headless: true
		// });

		// var page = await browser.newPage();

		// await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		// 	waitUntil: 'networkidle0'
		// });

		// await page.pdf(options);
		// await browser.close();
	}
}