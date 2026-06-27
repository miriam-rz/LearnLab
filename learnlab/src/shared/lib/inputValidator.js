//
// Live in shared/ because it's reusable in any module:
// sorting, trees, pathfinding, stacks, queues, etc.
//

// Dangerous Patterns: 
// List of expressions that shouldn't appear in simple code responses.
// If any match, we reject the input immediately
// before any comparison.
const DANGEROUS_PATTERNS = [
  /<script/i,           
  /javascript:/i,      
  /on\w+\s*=/i,      
  /eval\s*\(/i,        
  /function\s*\(/i,   
  /=>/,              
  /import\s/i,         
  /require\s*\(/i,  
  /document\./i,        
  /window\./i,        
  /fetch\s*\(/i,        
  /\$\{/,               
  /<!--/,              
  /\/\*[\s\S]*?\*\//,   
]

function containsDangerousPatterns(input) {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input))
}

// Normalization:
// Applies the same transformations to user input AND to valid responses so that the comparison is fair.
// Example: "n - 1", "n-1", "N - 1", "n - 1" - all equivalent.

function normalize(str) {
  return str
    .trim()                       
    .toLowerCase()                 
    .replace(/\s+/g, ' ')          
    .replace(/\u200B/g, '')       
    .replace(/\u00A0/g, ' ')     
    .replace(/['']/g, "'")         
    .replace(/[""]/g, '"')         
}

// Main Validation:
// Receives user input and the gap definition.
// Returns true only if the input matches a valid answer.
// Parameters:
// userInput — string entered or selected by the user
// blank — gap object with { answer, alternatives? }

export function validateInput(userInput, blank) {
  if (typeof userInput !== 'string')        return false
  if (typeof blank !== 'object' || !blank)  return false
  if (typeof blank.answer !== 'string')     return false

  const trimmed = userInput.trim()
  if (trimmed.length === 0)   return false  
  if (trimmed.length > 60)    return false  

  if (containsDangerousPatterns(trimmed)) return false

  const validAnswers = [
    blank.answer,
    ...(Array.isArray(blank.alternatives) ? blank.alternatives : []),
  ]

  const normalizedInput = normalize(trimmed)

  return validAnswers.some(ans => normalize(ans) === normalizedInput)
}

// Paste text sanitization:
// Cleans text that comes from a paste event before saving it.

export function sanitizePaste(rawText) {
  if (typeof rawText !== 'string') return ''

  return rawText
    .replace(/[\r\n\t]/g, ' ') 
    .replace(/\s+/g, ' ')        
    .replace(/\u200B/g, '')     
    .replace(/\u00A0/g, ' ')   
    .trim()
    .slice(0, 60)               
}
