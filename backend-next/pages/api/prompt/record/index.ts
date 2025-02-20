import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../../src/lib/auth/verify';
import { generateInitialPrompt } from '../../../../src/lib/core/generate_prompt';
import { ApiResponse } from '../../../../src/types/api';
import { corsMiddleware } from '../../../../src/lib/cors';
import {createConversation} from '../../../../src/lib/conversation';
import {Conversation} from '../../../../src/types/prompt';

/**
 * Record Conversation API
 * 
 * This API endpoint records a conversation.
 * 
 * @route POST /api/prompt/record
 * 
 * @authentication Required - Bearer token must be provided in Authorization header
 * 
 * @body {
 *   conversation: Conversation - The conversation to be recorded
 * }
 * 
 * @returns {
 *   status: 'success' | 'error',
 *   type?: 'prompt_record',
 *   data?: {
 *     docid: string - The document id of the conversation
 *   },
 *   error?: string - Error message if status is 'error'
 * }
* 
* @example
* // Request
* POST /api/prompt/record
* Authorization: Bearer <token>
* {
*   conversation: {
*     model: "gemma2:latest",
*     taskDescription: "Create a translation prompt for English to French",
*     initialPrompt: "Translate to French",
*     example: "Hello, how are you?",
*     initialOutput: "Bonjour, comment ça va?",
*     optimizedPrompt: "Please translate the following English text into French, maintaining the original tone and context while ensuring natural and fluent translation.",
*     critiqueFeedback: "The translation is not natural and fluent.",
*     refinedPrompts: ["Translate to French", "Translate to French with natural and fluent tone"],
*     variantOutputs: ["Bonjour, comment ça va?", "Bonjour, comment ça va?"],
*     variantPrompts: ["Translate to French", "Translate to French"]
*   }
* }
* 
* // Success Response
* {
*   "status": "success",
*   "type": "prompt_record", 
*   "data": {
*     "docid": "1234567890"
*   }
* }
* 
* // Error Response
* {
*   "status": "error",
*   "error": "Missing required fields"
* }
*/

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse<ApiResponse>
) {
 if (corsMiddleware(req, res)) {
   return;
 }

 try {
   // 1. 驗證 token
   const authHeader = req.headers.authorization;
   if (!authHeader) {
     return res.status(401).json({
       status: 'error',
       error: 'No authorization header'
     });
   }

   const token = authHeader.replace('Bearer ', '');
   const { uid } = await verifyToken(token);
   
   // 2. 解析請求體
   if (!req.body) {
     return res.status(400).json({
       status: 'error',
       error: 'Missing request body'
     });
   }

   const { conversation } = req.body;
   if (!conversation) {
     return res.status(400).json({
       status: 'error',
       error: 'Missing required fields'
     });
   }

   // 3. 調用核心邏輯
   const result = await createConversation(conversation, uid);
   
   // 4. 返回結果
   return res.status(200).json({
     status: 'success',
     type: 'prompt_record',
     data: {
       docid: result.id
     }
   });
 } catch (error) {
   console.error('Error in generate_prompt API:', error);
   return res.status(500).json({ 
     status: 'error',
     error: 'Internal server error' 
   });
 }
} 