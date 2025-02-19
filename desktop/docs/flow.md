
/**
 * Generate Initial Prompt API
 * 
 * This API endpoint generates an optimized initial prompt based on a task description and initial prompt.
 * 
 * @route POST /api/core/generate_prompt
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   taskDescription: string - Description of the task/context for prompt generation
 *   initialPrompt: string - The initial prompt to be optimized
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'prompt_optimization',
 *   data?: {
 *     optimizedPrompt: string - The optimized prompt
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/generate_prompt
 * Authorization: Bearer <token>
 * {
 *   "taskDescription": "Create a translation prompt for English to French",
 *   "initialPrompt": "Translate to French"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "prompt_optimization", 
 *   "data": {
 *     "optimizedPrompt": "Please translate the following English text into French, maintaining the original tone and context while ensuring natural and fluent translation."
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error",
 *   "error": "Missing required fields"
 * }
 */

/**
 * Generate Prompt Variants API
 * 
 * This API endpoint generates variations of a given prompt based on a task description.
 * 
 * @route POST /api/core/generate_variants
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The initial prompt to generate variants from
 *   taskDescription: string - Description of the task/context for prompt generation
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'prompt_variants',
 *   data?: {
 *     variants: string[] - Array of generated prompt variants
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/generate_variants
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Translate this text to French",
 *   "taskDescription": "Create a translation prompt"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success", 
 *   "type": "prompt_variants",
 *   "data": {
 *     "variants": [
 *       "Please translate the following text into French while maintaining the original tone",
 *       "Convert this text to French, preserving its style and meaning",
 *       // ... more variants
 *     ]
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error",
 *   "error": "Missing required fields"
 * }
 */

/**
 * Critique Generation API
 * 
 * This API endpoint generates a critique for a given prompt by comparing it with an example.
 * 
 * @route POST /api/core/critique
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The prompt to be critiqued
 *   example: string - An example prompt to compare against
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type: 'critique_feedback',
 *   data?: {
 *     critiqueFeedback: string - The generated critique feedback
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/critique
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Write a story about a dog",
 *   "example": "Create an engaging story about a loyal dog who helps their owner overcome challenges"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "critique_feedback",
 *   "data": {
 *     "critiqueFeedback": "The prompt lacks specific details and emotional elements" 
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error", 
 *   "error": "Missing required fields"
 * }
 */

/**
 * Refine Prompt API
 * 
 * This API endpoint refines a prompt based on critique feedback.
 * 
 * @route POST /api/core/refine_prompt
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   prompt: string - The prompt to be refined
 *   critiqueFeedback: string - Feedback from critique to guide refinement
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'refined_prompt',
 *   data?: {
 *     refinedPrompts: string[] - The refined prompts based on feedback
 *   },
 *   error?: string - Error message if status is 'error'
 * }
 * 
 * @example
 * // Request
 * POST /api/core/refine_prompt
 * Authorization: Bearer <token>
 * {
 *   "prompt": "Write a story about a dog",
 *   "critiqueFeedback": "The prompt lacks specific details about the dog's characteristics and story elements"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "type": "refined_prompt",
 *   "data": {
 *     "refinedPrompts": [
 *       "Write an engaging story about a loyal German Shepherd who helps their elderly owner overcome daily challenges while dealing with city life",
 *       "Create a story about a dog that learns to navigate city life and helps its owner overcome challenges"
 *     ]
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "status": "error",
 *   "error": "Missing required fields"
 * }
 */
