import React, { useState } from 'react';
import { Stage, Layer, Line, Circle, Group, Shape } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CANVAS_CONFIG } from '../constants/game';
import Konva from 'konva';

interface GameCanvasProps {
  angle: number;
  targetAngle: number;
  isCorrect: boolean;
  onDragMove: (angle: number) => void;
  totalRotation?: number; // 累积旋转角度，可选参数
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  angle,
  targetAngle,
  isCorrect,
  onDragMove,
  totalRotation = 0, // 默认值为0
}) => {
  const [hasStartedRotating, setHasStartedRotating] = useState(false);
  const { width, height, radius } = CANVAS_CONFIG;
  const centerX = width / 2;
  const centerY = height / 2;

  const handleDragStart = () => {
    setHasStartedRotating(true);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    let newAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (newAngle < 0) newAngle += 360;
    
    onDragMove(newAngle);
  };

  // 计算用于绘制角度指示器的参数
  const angleIndicatorParams = {
    startAngle: -90, // 始终从顶部（12点钟方向）开始
    endAngle: -90 + totalRotation, // 累积旋转角度
    isClockwise: totalRotation >= 0 // 旋转方向
  };
  
  // 绘制角度指示器的自定义函数
  const drawAngleIndicator = (ctx: Konva.Context, _: Konva.Shape) => {
    const { startAngle, endAngle } = angleIndicatorParams;
    
    ctx.beginPath();
    
    // 移动到圆心
    ctx.moveTo(centerX, centerY);
    
    // 绘制扇形
    ctx.arc(
      centerX, 
      centerY, 
      radius, 
      (startAngle * Math.PI) / 180, 
      (endAngle * Math.PI) / 180, 
      totalRotation < 0 // 逆时针方向则为true
    );
    
    // 关闭路径
    ctx.closePath();
    
    // 填充颜色 - 使用更亮的颜色
    ctx.fillStyle = totalRotation >= 0 ? '#5B8FF9' : '#FF6B6B'; // 更亮的蓝色和红色
    ctx.globalAlpha = 0.45; // 显著增加不透明度
    ctx.fill();
  };

  // 绘制角度箭头的自定义函数 - 使用渐开线
  const drawAngleArrow = (ctx: Konva.Context, _: Konva.Shape) => {
    // 设置线条样式
    ctx.strokeStyle = isCorrect ? "#4AE54A" : (totalRotation >= 0 ? "#5B8FF9" : "#FF6B6B");
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    // 基础参数
    const baseRadius = radius * 0.3; // 起始半径
    const radiusGrowthRate = 0.08; // 显著增加半径增长率
    
    // 角度计算
    const startAngle = -90 * (Math.PI / 180); // 12点钟方向
    const rotationInRadians = totalRotation * (Math.PI / 180); // 将累积旋转角度转换为弧度
    
    // 计算绘制的结束角度
    const endAngle = startAngle + rotationInRadians;
    
    // 分段绘制渐开线，增加分段数量使曲线更平滑
    const segments = 200;
    const angleStep = (endAngle - startAngle) / segments;
    
    // 计算起点
    let currentAngle = startAngle;
    let currentRadius = baseRadius;
    let x = centerX + currentRadius * Math.cos(currentAngle);
    let y = centerY + currentRadius * Math.sin(currentAngle);
    ctx.moveTo(x, y);
    
    // 逐段绘制渐开线
    for (let i = 1; i <= segments; i++) {
      currentAngle = startAngle + i * angleStep;
      
      // 计算当前旋转的圈数，用于控制半径增长
      const turns = Math.abs(currentAngle - startAngle) / (2 * Math.PI);
      
      // 半径随旋转圈数增长
      currentRadius = baseRadius + (radius * radiusGrowthRate * turns);
      
      x = centerX + currentRadius * Math.cos(currentAngle);
      y = centerY + currentRadius * Math.sin(currentAngle);
      ctx.lineTo(x, y);
    }
    
    // 绘制线条
    ctx.stroke();
    
    // 计算箭头的终点
    const endX = x;
    const endY = y;
    
    // 计算箭头点
    const arrowSize = 10;
    
    // 计算切线方向
    // 切线与半径的夹角取决于渐开线的参数方程
    // 这里我们计算切线角度为当前半径方向加上90度（或-90度，取决于旋转方向）
    const radialAngle = Math.atan2(endY - centerY, endX - centerX);
    const tangentAngle = radialAngle + (totalRotation >= 0 ? -Math.PI/2 : Math.PI/2);
    
    // 绘制箭头
    ctx.beginPath();
    const arrowX1 = endX + arrowSize * Math.cos(tangentAngle - Math.PI/6);
    const arrowY1 = endY + arrowSize * Math.sin(tangentAngle - Math.PI/6);
    const arrowX2 = endX + arrowSize * Math.cos(tangentAngle + Math.PI/6);
    const arrowY2 = endY + arrowSize * Math.sin(tangentAngle + Math.PI/6);
    
    ctx.moveTo(endX, endY);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.moveTo(endX, endY);
    ctx.lineTo(arrowX2, arrowY2);
    
    // 描边
    ctx.stroke();
  };

  const ticks = Array.from({ length: 36 }, (_, i) => {
    const tickAngle = i * 10;
    const isMainTick = i % 9 === 0;
    const tickLength = isMainTick ? 20 : 10;
    const startRadius = radius - tickLength;
    const startX = centerX + startRadius * Math.cos((tickAngle - 90) * Math.PI / 180);
    const startY = centerY + startRadius * Math.sin((tickAngle - 90) * Math.PI / 180);
    const endX = centerX + radius * Math.cos((tickAngle - 90) * Math.PI / 180);
    const endY = centerY + radius * Math.sin((tickAngle - 90) * Math.PI / 180);

    return (
      <Line
        key={tickAngle}
        points={[startX, startY, endX, endY]}
        stroke={isMainTick ? "#666" : "#999"}
        strokeWidth={isMainTick ? 2 : 1}
      />
    );
  });

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Background circle */}
        <Circle
          x={centerX}
          y={centerY}
          radius={radius}
          stroke="#ddd"
          strokeWidth={2}
        />

        {/* Tick marks */}
        {ticks}

        {/* 旋转角度扇形 - 显示累积旋转角度 */}
        {hasStartedRotating && totalRotation !== 0 && (
          <Shape
            sceneFunc={drawAngleIndicator}
            x={0}
            y={0}
          />
        )}

        {/* Target angle line */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * Math.cos((targetAngle - 90) * Math.PI / 180),
            centerY + radius * Math.sin((targetAngle - 90) * Math.PI / 180)
          ]}
          stroke="#aaa"
          strokeWidth={4}
          opacity={0.5}
        />

        {/* Current angle line */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * Math.cos((angle - 90) * Math.PI / 180),
            centerY + radius * Math.sin((angle - 90) * Math.PI / 180)
          ]}
          stroke={isCorrect ? "#4AE54A" : "#FF6B6B"} // 更亮的颜色
          strokeWidth={4}
        />

        {/* 角度箭头 - 使用累积旋转角度 */}
        {hasStartedRotating && totalRotation !== 0 && (
          <Shape
            sceneFunc={drawAngleArrow}
            x={0}
            y={0}
          />
        )}

        {/* Draggable handle */}
        <Group
          x={centerX + radius * Math.cos((angle - 90) * Math.PI / 180)}
          y={centerY + radius * Math.sin((angle - 90) * Math.PI / 180)}
          draggable
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
        >
          <Circle
            radius={24}
            fill="transparent"
            hitStrokeWidth={20}
          />
          <Circle
            radius={12}
            fill={isCorrect ? "#4CAF50" : "#EF4444"}
            opacity={0.2}
          />
          <Circle
            radius={8}
            fill={isCorrect ? "#4CAF50" : "#EF4444"}
          />
        </Group>

        {/* Center point */}
        <Circle
          x={centerX}
          y={centerY}
          radius={5}
          fill="#666"
        />
      </Layer>
    </Stage>
  );
};