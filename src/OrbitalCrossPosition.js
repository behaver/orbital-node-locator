'use strict';

const { SystemSwitcher } = require('@behaver/celestial-coordinate');
const { NewtonLinearSolver } = require('@behaver/linear-solver');

/**
 * OrbitalCrossPosition
 *
 * 轨道交点位置计算器
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
class OrbitalCrossPosition {

  /**
   * 构造函数
   *
   * @param {Boolean}          direction 目标交点方向设定
   * @param {CommonCoordinate} baseCoord 交点基础坐标
   */
  constructor({
    direction,
    baseCoord,
  } = {}) {
    this.private = {};

    this.SystemSwitcher = new SystemSwitcher;

    this.direction = direction === undefined ? true : direction;
    if (baseCoord !== undefined) this.on(baseCoord);
  }

  /**
   * 设置目标交点方向设定
   * 
   * @param {Boolean} value 目标交点方向设定
   */
  set direction(value) {
    this.private.direction = !! value;
  }

  /**
   * 获取目标交点方向设定
   * 
   * @return {Boolean} 目标交点方向设定
   */
  get direction() {
    return this.private.direction;
  }

  /**
   * 设定交点基础坐标
   * 
   * @param  {CommonCoordinate}     coord 交点基础坐标
   * 
   * @return {OrbitalCrossPosition}       返回 this 引用
   */
  on(coord) {
    this.private.baseCoord = coord;

    return this;
  };

  /**
   * 求解交点
   * 
   * @param  {String}           sys     目标天球系统缩写标识
   * @param  {Object}           options 目标坐标参数设定
   * 
   * @return {CommonCoordinate}         目标坐标
   */
  cross(sys, options) {
    let coord_o = this.private.baseCoord,
        coord_t = undefined,
        sc0 = coord_o.sc,
        SS = this.SystemSwitcher;

    // 构建用于迭代求解的线性函数
    let linear = function(phi) {
      let sc = coord_o.sc;

      sc.phi = phi;

      coord_o.sc = sc;
      
      coord_t = SS.from(coord_o).to(sys, options);

      return Math.PI / 2 - coord_t.sc.theta;
    }

    // 构建牛顿线性求解器
    let NLSolver = new NewtonLinearSolver({
      primitiveFunction: linear,
      originalX: sc0.phi,
      differentialX: 0.000005, // < 1分钟
      terminationError: 0.000003, // < 1″
    });
    
    // 处理获取迭代方向
    let gradient = NLSolver.gradient;
    while (gradient === 0) {
      NLSolver.originalX = NLSolver.originalX + NLSolver.differentialX; 
      gradient = NLSolver.gradient;
    }

    // 当前迭代方向
    let d = (gradient > 0);

    // 执行求解
    NLSolver.solve();

    // 恢复基础坐标
    this.private.baseCoord.sc = sc0;

    // 处理交点方向问题
    if (this.direction ^ !d) {
      let coord_t_sc = coord_t.sc;
      coord_t_sc.phi = coord_t_sc.phi - Math.sign(gradient) * Math.PI;
      coord_t_sc.theta = Math.PI - coord_t_sc.theta;
      coord_t.sc = coord_t_sc;
    }

    return coord_t;
  }
}

module.exports = OrbitalCrossPosition;
