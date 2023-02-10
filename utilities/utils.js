const fs = require("fs");
const path = require("path");
const PdfKit = require("pdfkit");
const Setting = require("../models/settings");

const textDirection = (str) => {
  const strArr = str.split(" ");
  newStr = strArr.reverse().join(" ");
  return newStr;
};

exports.printReceipt = async (order) => {
  const settings = await Setting.findOne({});
  let receiptAmounts = [];
  let totals = {};
  totals.tax = settings.taxRate;
  let subTotal = 0;
  for (let detail of order.orderDetails) {
    let receiptElement = {};
    receiptElement.itemTitle = detail.itemId.itemTitle;
    receiptElement.quantity = detail.quantity;
    receiptElement.price = detail.itemId.itemPrice;
    receiptElement.amount = detail.itemId.itemPrice * detail.quantity;
    subTotal += receiptElement.amount;
    receiptAmounts.push(receiptElement);
  }
  totals.subtotal = subTotal;
  totals.discount =
    settings.discountType === "ratio"
      ? subTotal * settings.discountAmount
      : subTotal - settings.discountAmount;
  totals.totalAmount = subTotal * settings.taxRate + subTotal - totals.discount;
  const receiptName = `${order.branchId._id}-${Date.now()}.pdf`;
  const receiptPath = path.join("receipts", receiptName);
  const pageWidth = (8 * 28.346456693).toFixed(2);
  const pageHieght = receiptAmounts.length * 50 + Number(pageWidth);
  const arFont = path.join("fonts", "Janna.ttf");
  const date = new Date().toDateString();
  const Doc = new PdfKit({ size: [Number(pageWidth), pageHieght], margin: 1 });
  Doc.pipe(fs.createWriteStream(receiptPath));
  Doc.font(arFont)
    .fontSize(11)
    .text(
      `${order.orderNumber}: الطلب رقم         ${textDirection(
        order.branchId.branchName
      )} : الفرع`,
      {
        align: "center",
      }
    );
  Doc.font(arFont).fontSize(11).text(`${date} : التاريخ`, { align: "center" });
  Doc.font(arFont)
    .fontSize(11)
    .text(`${textDirection(order.clientId.clientName)} : العميل اسم`, {
      align: "center",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(`${textDirection(order.clientId.phoneNumber)} : الهاتف`, {
      align: "center",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(`${textDirection(order.clientAddress)} : العنوان`, {
      align: "center",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(`--------------------------------------------`, {
      align: "center",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(`المبلغ        السعر        الكمية                        الصنف`, {
      align: "right",
    });
  for (let element of receiptAmounts) {
    Doc.font(arFont)
      .fontSize(11)
      .text(
        `${element.amount}           ${+element.price}            ${
          element.quantity
        }                ${textDirection(element.itemTitle)}`,
        { align: "right" }
      );
  }
  Doc.font(arFont)
    .fontSize(11)
    .text(`--------------------------------------------`, {
      align: "center",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(` ${totals.subtotal}              ${textDirection("اجمالى فرعى")}`, {
      align: "right",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(`${totals.tax}                        ${textDirection("الضريبه")}`, {
      align: "right",
    });
  Doc.font(arFont)
    .fontSize(11)
    .text(
      `${totals.discount}                   ${textDirection("مبلغ الخصم")}`,
      {
        align: "right",
      }
    );
  Doc.font(arFont)
    .fontSize(11)
    .text(
      `${totals.totalAmount}                ${textDirection("اجمالى عام")}`,
      {
        align: "right",
      }
    );
  Doc.font(arFont)
    .fontSize(11)
    .text(`--------------------------------------------`, {
      align: "center",
    });
  Doc.end();
  return { receipt: receiptName, total: totals.totalAmount };
};

exports.calcOrderTotal = async (order) => {
  const settings = await Setting.findOne({});
  let receiptAmounts = [];
  let totals = {};
  totals.tax = settings.taxRate;
  let subTotal = 0;
  for (let detail of order.orderDetails) {
    let receiptElement = {};
    receiptElement.itemTitle = detail.itemId.itemTitle;
    receiptElement.quantity = detail.quantity;
    receiptElement.price = detail.itemId.itemPrice;
    receiptElement.amount = detail.itemId.itemPrice * detail.quantity;
    subTotal += receiptElement.amount;
    receiptAmounts.push(receiptElement);
  }
  totals.subtotal = subTotal;
  totals.discount =
    settings.discountType === "ratio"
      ? subTotal * settings.discountAmount
      : subTotal - settings.discountAmount;
  totals.totalAmount = subTotal * settings.taxRate + subTotal - totals.discount;
  return totals.totalAmount;
};
