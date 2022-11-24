export const alerts = (isUniqueName: boolean, categoryName: string): string => {
  if (!isUniqueName) return 'すでにデータベースに登録されています';
  if (categoryName === '') return '未記入のため登録できません';
  return '分類先を選択してください';
};
