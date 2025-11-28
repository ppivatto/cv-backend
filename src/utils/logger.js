export function logInfo(tag, data = {}) {
  console.log(`🟦 [INFO] ${tag}`, JSON.stringify(data, null, 2));
}

export function logError(tag, err = {}) {
  console.error(`🟥 [ERROR] ${tag}`, JSON.stringify(err, null, 2));
}

export function logStep(tag) {
  console.log(`➡️  ${tag}`);
}
