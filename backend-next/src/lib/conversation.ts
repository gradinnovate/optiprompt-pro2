import {Prompt, Conversation} from '../types/prompt';
import {promptsRef} from '../lib/firebase/admin';

export async function createConversation(conversation: Conversation, uid: string): Promise<Prompt> {
  const doc = promptsRef.doc();
  const record = {
    uid: uid,
    conversation: conversation,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    await doc.set(record);
    return {
      id: doc.id,
      ...record
    };
  } catch (error) {
    throw new Error('Failed to create conversation');
  }
}

