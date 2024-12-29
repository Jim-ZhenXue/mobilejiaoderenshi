export const normalizeAngle = (angle: number): number => {
  // 将角度标准化到 0-360 范围内
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
};

export const checkAngleMatch = (current: number, target: number, tolerance: number): boolean => {
  const normalizedCurrent = normalizeAngle(current);
  const normalizedTarget = normalizeAngle(target);
  
  // 检查角度是否在容差范围内
  const diff = Math.abs(normalizedCurrent - normalizedTarget);
  return diff <= tolerance || Math.abs(360 - diff) <= tolerance;
};