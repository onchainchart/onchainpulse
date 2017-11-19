"use strict";

const moment = require("moment");
const raw_data = require('./raw_data.json');
const fs = require('fs');

let d = raw_data.map(item => Object.assign(item, {date: moment(item.date, 'MM/DD/YY').format('YYYY MMMM'), value: +item.value}));

let means = {};
let order = [];
d.forEach(item => {
  means[item.date] = means[item.date] || {sum: 0, count: 0};
  means[item.date].count++;
  means[item.date].sum += item.value;

  if (order[order.length - 1] !== item.date) order.push(item.date);
});
console.log(order.length);
let result = order.map(date => [date, +((means[date].sum / means[date].count).toFixed(0))]);
fs.writeFileSync('./data.json', JSON.stringify(result, null));