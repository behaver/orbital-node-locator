# OrbitalCrossPosition

## 简介

OrbitalCrossPosition 是天球系统轨道交点位置计算组件。

## 用例

```js
const OrbitalCrossPosition = require('../src/OrbitalCrossPosition');
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');

let OCP = new OrbitalCrossPosition({
  direction: true,
});

let ECC = OCP.on(new HorizontalCoordinate({
  a: 270,
  h: 0,
  obGeoLong: -124.23,
  obGeoLat: 40.08,
  obTime: new JDateRepository(new Date(1992, 7, 15, 8, 25), 'date'),
  centerMode: 'geocentric',
})).cross('ecc', {
  withNutation: true, 
});

// 输出交点黄经值
console.log(ECC.l.getDegrees());
```

## API

`constructor(options)`

构造函数:

* options.direction 目标交点方向设定
* options.baseCoord 交点基础坐标

`on(coord)`

设定交点基础坐标:

* coord 交点基础坐标

`cross(sys, options)`

求解交点坐标:

* sys 目标天球系统缩写标识
* options 目标坐标参数设定

`set direction(value)`

设置目标交点方向设定

`get direction()`

获取目标交点方向设定

## 许可证书

The ISC license.