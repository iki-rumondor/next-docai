export interface ComparisonResult {
  isIdentical: boolean;
  accuracy: number;
  diffDetails: {
    line: number;
    valueA: string;
    valueB: string;
    isMatch: boolean;
  }[];
}

/**
 * Compares two JSON objects strictly (including key order and data types)
 * Accuracy is calculated based on line-by-line similarity of formatted JSON
 */
export function compareJsonStrict(jsonA: string, jsonB: string): ComparisonResult {
  try {
    const objA = JSON.parse(jsonA);
    const objB = JSON.parse(jsonB);

    // Formatted strings to maintain order as provided in the input
    // If the input was already parsed, we rely on how JSON.stringify behaves
    // However, if the user wants strict KEY ORDER, they should ideally provide the strings
    // or we should NOT sort keys.
    const strA = JSON.stringify(objA, null, 2);
    const strB = JSON.stringify(objB, null, 2);

    if (strA === strB) {
      return {
        isIdentical: true,
        accuracy: 100,
        diffDetails: []
      };
    }

    const linesA = strA.split('\n');
    const linesB = strB.split('\n');
    const maxLines = Math.max(linesA.length, linesB.length);
    
    let matches = 0;
    const diffDetails: ComparisonResult['diffDetails'] = [];

    for (let i = 0; i < maxLines; i++) {
      const lineA = linesA[i] || "";
      const lineB = linesB[i] || "";
      const isMatch = lineA.trim() === lineB.trim();

      if (isMatch) {
        matches++;
      }

      diffDetails.push({
        line: i + 1,
        valueA: lineA,
        valueB: lineB,
        isMatch
      });
    }

    const accuracy = (matches / maxLines) * 100;

    return {
      isIdentical: false,
      accuracy: Math.round(accuracy * 100) / 100,
      diffDetails
    };
  } catch {
    throw new Error("Invalid JSON input");
  }
}
