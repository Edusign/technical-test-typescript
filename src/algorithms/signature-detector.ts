/**
 * EXERCICE PERFORMANCE ALGORITHMIQUE
 * 
 * Ce fichier contient des algorithmes de détection et validation de signatures
 * qui doivent être optimisés pour gérer un grand volume de données.
 * 
 * OBJECTIF: Optimiser ces fonctions pour traiter efficacement des milliers de signatures
 * CONTRAINTES: Performance acceptable + consommation mémoire maîtrisée
 */

/**
 * Interface représentant une signature numérique
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
 * Interface pour le résultat de détection de doublons
 */
interface DuplicateResult {
    original: number;
    duplicate: number;
    similarity: number;
}

/**
 * Interface pour le résultat de validation
 */
interface ValidationResult {
    isValid: boolean;
    confidence: number;
    reason?: string;
}

/**
 * Détection de signatures dupliquées
 * 
 * Cette fonction détecte les signatures identiques ou très similaires.
 * Actuellement utilisée pour éviter la fraude (même signature utilisée plusieurs fois).
 */
function findDuplicateSignatures(signatures: Signature[]): DuplicateResult[] {
    console.time('findDuplicates');
    const duplicates: DuplicateResult[] = [];
    
    // Implémentation actuelle
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
 * Validation avec cache
 * 
 * Cette fonction valide les signatures en utilisant un cache pour éviter
 * de refaire les mêmes calculs coûteux.
 */
const signatureCache = new Map<string, ValidationResult>();

function validateSignatureWithCache(signature: Signature): ValidationResult {
    const key = `${signature.id}_${signature.hash}`;
    
    if (signatureCache.has(key)) {
        return signatureCache.get(key)!;
    }
    
    // Validation coûteuse (simule un algorithme ML complexe)
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
 * Recherche de signatures suspectes
 * 
 * Cette fonction trouve toutes les signatures ayant un score de suspicion
 * supérieur à un seuil donné. Les signatures sont pré-triées par score.
 */
function findSuspiciousSignatures(signatures: Signature[], threshold: number = 0.8): Signature[] {
    const suspicious: Signature[] = [];
    
    // Recherche dans la liste triée
    for (const signature of signatures) {
        if (signature.suspicionScore >= threshold) {
            suspicious.push(signature);
        }
    }
    
    return suspicious;
}

/**
 * Comparaison de signatures
 * 
 * Compare deux signatures en analysant leurs caractéristiques.
 * Retourne un score de similarité entre 0 et 1.
 */
function compareSignatures(sig1: Signature, sig2: Signature): number {
    if (!sig1.pixels || !sig2.pixels) return 0;
    
    let matches = 0;
    const total = sig1.pixels.length;
    
    // Comparaison détaillée
    for (let i = 0; i < total; i++) {
        if (sig1.pixels[i] === sig2.pixels[i]) {
            matches++;
        }
    }
    
    return matches / total;
}

/**
 * Nouvelle fonction à implémenter : Détection de signatures générées par IA
 * 
 * TODO: Implémenter une fonction qui détecte si une signature a été générée
 * artifiellement par une IA plutôt que dessinée par un humain.
 * 
 * Indices : 
 * - Les signatures humaines ont des imperfections naturelles
 * - Les signatures IA ont souvent des patterns répétitifs
 * - Analyser la régularité du trait, la pression, etc.
 */
function detectAIGeneratedSignature(signature: Signature): boolean {
    // TODO: À implémenter
    return false;
}

/**
 * Interface pour les options de génération de signatures de test
 */
interface GenerationOptions {
    includeTimestamp?: boolean;
    minSuspicionScore?: number;
    maxSuspicionScore?: number;
    pixelVariance?: number;
}

/**
 * FONCTIONS UTILITAIRES (NE PAS MODIFIER)
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