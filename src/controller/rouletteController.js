import YAML from 'yaml';

export const FALLBACK_NAMES = [
  '雨宫莲', '高卷杏', '坂本龙司',
  '喜多川祐介', '新岛真', '佐仓双叶',
  '奥村春', '明智吾郎'
];

export const parseNamesFromConfig = (configSource) => {
  if (!configSource) {
    return [];
  }

  try {
    const parsed = YAML.parse(configSource);
    if (Array.isArray(parsed?.names)) {
      return parsed.names.map((name) => String(name).trim()).filter(Boolean);
    }
  } catch (error) {
    console.error('Failed to parse config file:', error);
  }
  return [];
};

export const buildDefaultNames = (configSource, fallbackNames = FALLBACK_NAMES) => {
  const configNames = parseNamesFromConfig(configSource);
  return configNames.length ? configNames : fallbackNames;
};

export const drawRouletteWheel = (canvas, names, rotationRadians) => {
  if (!canvas || !names?.length) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 20;
  const step = (2 * Math.PI) / names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotationRadians);

  names.forEach((name, index) => {
    const startAngle = index * step;
    const endAngle = startAngle + step;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? '#000000' : '#E60012';

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.save();
    ctx.rotate(startAngle + step / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Arial Black", sans-serif';

    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(name, radius - 20, 0);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 25, 0, 2 * Math.PI);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.restore();
};

export const pickWinner = (rotationRadians, names) => {
  if (!names?.length) {
    return null;
  }

  const totalRotation = rotationRadians % (2 * Math.PI);
  const step = (2 * Math.PI) / names.length;
  let normalizedRotation = (2 * Math.PI - totalRotation) % (2 * Math.PI);
  if (normalizedRotation < 0) {
    normalizedRotation += 2 * Math.PI;
  }

  const winningIndex = Math.floor(normalizedRotation / step);
  return names[winningIndex];
};
