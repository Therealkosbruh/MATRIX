type ContentData = Record<string, any>;

/**
 * Универсальная функция для получения контента по ключу из JSON файла
 * @param fileName - название JSON файла без расширения (например, 'characters')
 * @param key - путь к данным через точку (например, 'characters.neo.name')
 * @returns значение по указанному ключу или undefined
 */
export async function getContent(fileName: string, key: string): Promise<any> {
  try {
    const data: ContentData = await import(`../assets/texts/${fileName}.json`);
    const keys = key.split('.');
    let result: any = data;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Ключ "${key}" не найден в файле ${fileName}.json`);
        return undefined;
      }
    }
    return result;
  } catch (error) {
    console.error(`Ошибка при загрузке файла ${fileName}.json:`, error);
    return undefined;
  }
}

/**
 * Синхронная версия для уже импортированных данных
 * @param data - объект с данными
 * @param key - путь к данным через точку
 * @returns значение по указанному ключу или undefined
 */
export function getContentSync(data: ContentData, key: string): any {
  const keys = key.split('.');
  let result: any = data;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      console.warn(`Ключ "${key}" не найден`);
      return undefined;
    }
  }
  return result;
}