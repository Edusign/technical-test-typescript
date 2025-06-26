/**
 * ALGORITHMIC PERFORMANCE EXERCISE
 * 
 * This file contains signature detection and validation algorithms
 * that need to be optimized to handle large volumes of data.
 * 
 * OBJECTIVE: Optimize these functions to efficiently process thousands of signatures
 * CONSTRAINTS: Acceptable performance + controlled memory consumption
 */

/**
 * Interface representing a digital signature
 */
interface Signature {
    id: number;
    hash: string;
    suspicionScore: number;
    pixels: number[];
    timestamp?: Date;
    studentId?: number;
}

/**
 * Interface for duplicate detection result
 */
interface DuplicateResult {
    original: number;
    duplicate: number;
    similarity: number;
}

/**
 * Interface for validation result
 */
interface ValidationResult {
    isValid: boolean;
    confidence: number;
    reason?: string;
}

/**
 * Duplicate signature detection
 * 
 * This function detects identical or very similar signatures.
 * Currently used to prevent fraud (same signature used multiple times).
 */
function findDuplicateSignatures(signatures: Signature[]): DuplicateResult[] {
    console.time('findDuplicates');
    const duplicates: DuplicateResult[] = [];
    
    // Current implementation
    for (let i = 0; i < signatures.length; i++) {
        for (let j = i + 1; j < signatures.length; j++) {
            const similarity = compareSignatures(signatures[i], signatures[j]);
            if (similarity > 0.95) {
                duplicates.push({
                    original: i,
                    duplicate: j,
                    similarity
                });
            }
        }
    }
    
    console.timeEnd('findDuplicates');
    return duplicates;
}

/**
 * Validation with cache
 * 
 * This function validates signatures using a cache to avoid
 * redoing the same expensive calculations.
 */
const signatureCache = new Map<string, ValidationResult>();

function validateSignatureWithCache(signature: Signature): ValidationResult {
    const key = `${signature.id}_${signature.hash}`;
    
    if (signatureCache.has(key)) {
        return signatureCache.get(key)!;
    }
    
    // Expensive validation (simulates a complex ML algorithm)
    const isValid = expensiveValidation(signature);
    const result: ValidationResult = {
        isValid,
        confidence: isValid ? 0.9 : 0.1,
        reason: isValid ? 'Valid signature' : 'Invalid signature'
    };
    
    signatureCache.set(key, result);
    return result;
}

/**
 * Search for suspicious signatures
 * 
 * This function finds all signatures with a suspicion score
 * above a given threshold. Signatures are pre-sorted by score.
 */
function findSuspiciousSignatures(signatures: Signature[], threshold: number = 0.8): Signature[] {
    const suspicious: Signature[] = [];
    
    // Search in the sorted list
    for (const signature of signatures) {
        if (signature.suspicionScore >= threshold) {
            suspicious.push(signature);
        }
    }
    
    return suspicious;
}

/**
 * Signature comparison
 * 
 * Compares two signatures by analyzing their characteristics.
 * Returns a similarity score between 0 and 1.
 */
function compareSignatures(sig1: Signature, sig2: Signature): number {
    if (!sig1.pixels || !sig2.pixels) return 0;
    
    let matches = 0;
    const total = sig1.pixels.length;
    
    // Detailed comparison
    for (let i = 0; i < total; i++) {
        if (sig1.pixels[i] === sig2.pixels[i]) {
            matches++;
        }
    }
    
    return matches / total;
}

/**
 * New function to implement: AI-generated signature detection
 * 
 * TODO: Implement a function that detects if a signature was generated
 * artificially by AI rather than drawn by a human.
 * 
 * Hints: 
 * - Human signatures have natural imperfections
 * - AI signatures often have repetitive patterns
 * - Analyze stroke regularity, pressure, etc.
 */
function detectAIGeneratedSignature(signature: Signature): boolean {
    // TODO: To implement
    return false;
}

/**
 * Interface for test signature generation options
 */
interface GenerationOptions {
    includeTimestamp?: boolean;
    minSuspicionScore?: number;
    maxSuspicionScore?: number;
    pixelVariance?: number;
}

/**
 * UTILITY FUNCTIONS (DO NOT MODIFY)
 */

/**
 * Simule une validation coûteuse de signature
 */
function expensiveValidation(signature: Signature): boolean {
    // Simule une validation ML coûteuse (100ms)
    const start = Date.now();
    while (Date.now() - start < 100) {} 
    return Math.random() > 0.1; // 90% de signatures valides
}

/**
 * Génère des signatures de test pour les benchmarks
 */
function generateTestSignatures(count: number, options: GenerationOptions = {}): Signature[] {
    const {
        includeTimestamp = false,
        minSuspicionScore = 0,
        maxSuspicionScore = 1,
        pixelVariance = 255
    } = options;

    const signatures: Signature[] = [];
    
    for (let i = 0; i < count; i++) {
        const signature: Signature = {
            id: i,
            hash: `hash_${i}`,
            suspicionScore: minSuspicionScore + Math.random() * (maxSuspicionScore - minSuspicionScore),
            pixels: new Array(1000).fill(0).map(() => Math.floor(Math.random() * pixelVariance))
        };

        if (includeTimestamp) {
            signature.timestamp = new Date(Date.now() - Math.random() * 86400000); // Dernières 24h
        }

        signatures.push(signature);
    }
    
    return signatures;
}

/**
 * Type pour les métriques de performance
 */
interface PerformanceMetrics {
    executionTime: number;
    memoryUsage: number;
    operationsCount: number;
}

/**
 * Fonction de mesure de performance
 */
function measurePerformance<T>(fn: () => T, operationsCount: number = 1): PerformanceMetrics & { result: T } {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    const result = fn();
    
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;
    
    return {
        result,
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        operationsCount
    };
}

/**
 * TESTS DE PERFORMANCE
 * 
 * Décommentez pour tester les performances actuelles.
 * Attention : avec de gros volumes, certains tests peuvent être très lents !
 */
/*
console.log('=== TESTS DE PERFORMANCE ===');

// Test avec différentes tailles
const sizes: number[] = [100, 500, 1000];

sizes.forEach(size => {
    console.log(`\n--- Tests avec ${size} signatures ---`);
    const testSignatures = generateTestSignatures(size);
    
    // Test détection doublons
    console.log('1. Détection doublons:');
    if (size <= 500) { // Éviter les timeouts
        const metrics = measurePerformance(
            () => findDuplicateSignatures(testSignatures.slice(0, Math.min(size, 100))),
            Math.min(size, 100)
        );
        console.log(`Temps: ${metrics.executionTime.toFixed(2)}ms, Mémoire: ${metrics.memoryUsage} bytes`);
    } else {
        console.log('Skipped (too slow)');
    }
    
    // Test cache
    console.log('2. Cache validation:');
    const cacheMetrics = measurePerformance(() => {
        for (let i = 0; i < Math.min(size, 50); i++) {
            validateSignatureWithCache(testSignatures[i]);
        }
    }, Math.min(size, 50));
    console.log(`Temps: ${cacheMetrics.executionTime.toFixed(2)}ms`);
    
    // Test recherche
    console.log('3. Recherche suspectes:');
    const searchMetrics = measurePerformance(
        () => findSuspiciousSignatures(testSignatures, 0.8),
        size
    );
    console.log(`Temps: ${searchMetrics.executionTime.toFixed(2)}ms, Trouvées: ${searchMetrics.result.length}`);
});

console.log('\n=== FIN TESTS ===');
*/

// Export des fonctions et types
export {
    Signature,
    DuplicateResult,
    ValidationResult,
    GenerationOptions,
    PerformanceMetrics,
    findDuplicateSignatures,
    validateSignatureWithCache,
    findSuspiciousSignatures,
    compareSignatures,
    detectAIGeneratedSignature,
    generateTestSignatures,
    measurePerformance
}; 