export interface ComparisonResult {
  isIdentical: boolean;
  accuracy: number;
  diffDetails: {
    line: number;
    valueA: string;
    valueB: string;
    valueC?: string;
    isMatch: boolean; // True if all provided values match
  }[];
}

/**
 * Compares two JSON objects strictly
 */
export function compareJsonStrict(jsonA: string, jsonB: string): ComparisonResult {
  try {
    const objA = JSON.parse(jsonA || "{}");
    const objB = JSON.parse(jsonB || "{}");

    const strA = JSON.stringify(objA, null, 2);
    const strB = JSON.stringify(objB, null, 2);

    const linesA = strA.split('\n');
    const linesB = strB.split('\n');
    const maxLines = Math.max(linesA.length, linesB.length);
    
    let matches = 0;
    const diffDetails: ComparisonResult['diffDetails'] = [];

    for (let i = 0; i < maxLines; i++) {
      const lineA = linesA[i] || "";
      const lineB = linesB[i] || "";
      const isMatch = lineA.trim() === lineB.trim();

      if (isMatch) matches++;

      diffDetails.push({
        line: i + 1,
        valueA: lineA,
        valueB: lineB,
        isMatch
      });
    }

    const accuracy = (matches / maxLines) * 100;

    return {
      isIdentical: strA === strB,
      accuracy: Math.round(accuracy * 100) / 100,
      diffDetails
    };
  } catch {
    throw new Error("Invalid JSON input");
  }
}

/**
 * Compares THREE JSON objects strictly
 */
export function compareJsonStrict3(jsonA: string, jsonB: string, jsonC: string): ComparisonResult {
  try {
    const objA = JSON.parse(jsonA || "{}");
    const objB = JSON.parse(jsonB || "{}");
    const objC = JSON.parse(jsonC || "{}");

    const strA = JSON.stringify(objA, null, 2);
    const strB = JSON.stringify(objB, null, 2);
    const strC = JSON.stringify(objC, null, 2);

    const linesA = strA.split('\n');
    const linesB = strB.split('\n');
    const linesC = strC.split('\n');
    const maxLines = Math.max(linesA.length, linesB.length, linesC.length);
    
    let matches = 0;
    const diffDetails: ComparisonResult['diffDetails'] = [];

    for (let i = 0; i < maxLines; i++) {
      const lineA = linesA[i] || "";
      const lineB = linesB[i] || "";
      const lineC = linesC[i] || "";
      
      // Strict matching: All three must match
      const isMatch = (lineA.trim() === lineB.trim()) && (lineB.trim() === lineC.trim());

      if (isMatch) matches++;

      diffDetails.push({
        line: i + 1,
        valueA: lineA,
        valueB: lineB,
        valueC: lineC,
        isMatch
      });
    }

    const accuracy = (matches / maxLines) * 100;

    return {
      isIdentical: (strA === strB) && (strB === strC),
      accuracy: Math.round(accuracy * 100) / 100,
      diffDetails
    };
  } catch {
    throw new Error("Invalid JSON input for 3-way comparison");
  }
}
