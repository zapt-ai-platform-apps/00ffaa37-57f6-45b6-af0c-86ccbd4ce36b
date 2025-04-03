import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanObjectForUpdate } from '../api';

describe('Apps API Utilities', () => {
  describe('cleanObjectForUpdate', () => {
    it('should remove timestamp fields from an object', () => {
      const input = {
        id: '123',
        name: 'Test App',
        description: 'Test description',
        createdAt: new Date(),
        created_at: new Date(),
        completedAt: '2023-01-01'
      };
      
      const result = cleanObjectForUpdate(input);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('created_at');
      expect(result).not.toHaveProperty('completedAt');
    });

    it('should handle null or undefined input', () => {
      expect(cleanObjectForUpdate(null)).toEqual({});
      expect(cleanObjectForUpdate(undefined)).toEqual({});
    });

    it('should not modify objects without timestamp fields', () => {
      const input = {
        id: '123',
        name: 'Test App',
        description: 'Test description'
      };
      
      const result = cleanObjectForUpdate(input);
      expect(result).toEqual(input);
    });

    it('should remove all types of timestamp fields', () => {
      const input = {
        id: '123',
        updatedAt: new Date(),
        updated_at: new Date(),
        deletedAt: new Date(),
        deleted_at: new Date(),
      };
      
      const result = cleanObjectForUpdate(input);
      
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('updated_at');
      expect(result).not.toHaveProperty('deletedAt');
      expect(result).not.toHaveProperty('deleted_at');
    });
  });
});