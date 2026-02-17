import { describe, it, expect } from 'vitest';
import { resolveTemplates, resolveTemplate } from '../dsl/templating.js';
import type { VariableContext } from '../dsl/types.js';

describe('DSL Templating', () => {
  describe('Basic Template Resolution', () => {
    it('should resolve input variables', () => {
      const context: VariableContext = {
        inputs: { username: 'john', age: 30 },
        vars: {},
      };

      const result = resolveTemplate('Hello {{inputs.username}}!', context);
      expect(result).toBe('Hello john!');
    });

    it('should resolve vars', () => {
      const context: VariableContext = {
        inputs: {},
        vars: { counter: 42, message: 'success' },
      };

      const result = resolveTemplate('Count: {{vars.counter}}', context);
      expect(result).toBe('Count: 42');
    });

    it('should resolve multiple templates in one string', () => {
      const context: VariableContext = {
        inputs: { first: 'John', last: 'Doe' },
        vars: {},
      };

      const result = resolveTemplate(
        'Name: {{inputs.first}} {{inputs.last}}',
        context
      );
      expect(result).toBe('Name: John Doe');
    });

    it('should resolve secrets when provided', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
        secrets: { API_KEY: 'secret123' },
      };

      const result = resolveTemplate('Key: {{secret.API_KEY}}', context);
      expect(result).toBe('Key: secret123');
    });
  });

  describe('Object Template Resolution', () => {
    it('should resolve templates in objects', () => {
      const context: VariableContext = {
        inputs: { url: 'https://example.com' },
        vars: { selector: '#submit' },
      };

      const obj = {
        url: '{{inputs.url}}',
        button: '{{vars.selector}}',
        static: 'no template',
      };

      const result = resolveTemplates(obj, context);
      expect(result).toEqual({
        url: 'https://example.com',
        button: '#submit',
        static: 'no template',
      });
    });

    it('should resolve templates in nested objects', () => {
      const context: VariableContext = {
        inputs: { baseUrl: 'https://example.com' },
        vars: { path: '/login' },
      };

      const obj = {
        config: {
          url: '{{inputs.baseUrl}}{{vars.path}}',
          timeout: 5000,
        },
      };

      const result = resolveTemplates(obj, context);
      expect(result).toEqual({
        config: {
          url: 'https://example.com/login',
          timeout: 5000,
        },
      });
    });

    it('should resolve templates in arrays', () => {
      const context: VariableContext = {
        inputs: { item1: 'apple', item2: 'banana' },
        vars: {},
      };

      const arr = ['{{inputs.item1}}', '{{inputs.item2}}', 'cherry'];

      const result = resolveTemplates(arr, context);
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing variables gracefully', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
      };

      const result = resolveTemplate('Hello {{inputs.missing}}!', context);
      // Should return empty string for missing variables (throwOnUndefined: false)
      expect(result).toBe('Hello !');
    });

    it('should not resolve non-template strings', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
      };

      const result = resolveTemplate('Just a regular string', context);
      expect(result).toBe('Just a regular string');
    });

    it('should handle empty template', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
      };

      const result = resolveTemplate('', context);
      expect(result).toBe('');
    });

    it('should handle numeric values', () => {
      const context: VariableContext = {
        inputs: { count: 10 },
        vars: {},
      };

      const result = resolveTemplates(42, context);
      expect(result).toBe(42);
    });

    it('should handle boolean values', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
      };

      const result = resolveTemplates(true, context);
      expect(result).toBe(true);
    });

    it('should handle null values', () => {
      const context: VariableContext = {
        inputs: {},
        vars: {},
      };

      const result = resolveTemplates(null, context);
      expect(result).toBe(null);
    });
  });

  describe('Built-in Filters', () => {
    it('should support urlencode filter', () => {
      const context: VariableContext = {
        inputs: { query: 'hello world' },
        vars: {},
      };

      const result = resolveTemplate('?q={{inputs.query | urlencode}}', context);
      expect(result).toBe('?q=hello%20world');
    });

    it('should support upper filter', () => {
      const context: VariableContext = {
        inputs: { text: 'hello' },
        vars: {},
      };

      const result = resolveTemplate('{{inputs.text | upper}}', context);
      expect(result).toBe('HELLO');
    });
  });

  describe('Complex Scenarios', () => {
    it('should resolve nested property access', () => {
      const context: VariableContext = {
        inputs: {},
        vars: { user: { name: 'John', age: 30 } },
      };

      // Nunjucks supports dot notation for nested access
      const result = resolveTemplate('Name: {{vars.user.name}}', context);
      expect(result).toBe('Name: John');
    });

    it('should combine multiple variable sources', () => {
      const context: VariableContext = {
        inputs: { prefix: 'Mr.' },
        vars: { name: 'Smith' },
        secrets: { suffix: 'Jr.' },
      };

      const result = resolveTemplate(
        '{{inputs.prefix}} {{vars.name}} {{secret.suffix}}',
        context
      );
      expect(result).toBe('Mr. Smith Jr.');
    });
  });
});
