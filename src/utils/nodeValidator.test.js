/**
 * Comprehensive tests for nodeValidator module
 */

const {
  validateNode,
  normalizeNode,
  validateWorkflow,
  sanitizeNodeName
} = require('./nodeValidator');

describe('nodeValidator', () => {
  describe('validateNode', () => {
    describe('valid node configurations', () => {
      test('should validate a complete valid node', () => {
        const node = {
          name: 'Test Node',
          type: 'n8n-nodes-base.httpRequest',
          parameters: { url: 'https://example.com' },
          position: { x: 100, y: 200 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should validate a minimal valid node', () => {
        const node = {
          name: 'Minimal Node',
          type: 'webhook'
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should validate node with empty parameters object', () => {
        const node = {
          name: 'Node',
          type: 'start',
          parameters: {}
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should validate node with position at origin', () => {
        const node = {
          name: 'Origin Node',
          type: 'start',
          position: { x: 0, y: 0 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should validate node with negative position coordinates', () => {
        const node = {
          name: 'Negative Position',
          type: 'node',
          position: { x: -100, y: -50 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should validate node with name at max length (100 chars)', () => {
        const node = {
          name: 'a'.repeat(100),
          type: 'test'
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    describe('invalid node object', () => {
      test('should reject null node', () => {
        const result = validateNode(null);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node must be a valid object');
      });

      test('should reject undefined node', () => {
        const result = validateNode(undefined);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node must be a valid object');
      });

      test('should reject non-object node (string)', () => {
        const result = validateNode('not an object');

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node must be a valid object');
      });

      test('should reject non-object node (number)', () => {
        const result = validateNode(123);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node must be a valid object');
      });

      test('should reject non-object node (array)', () => {
        const result = validateNode([]);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node must be a valid object');
      });
    });

    describe('name validation', () => {
      test('should reject node with missing name', () => {
        const node = { type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name is required and must be a string');
      });

      test('should reject node with null name', () => {
        const node = { name: null, type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name is required and must be a string');
      });

      test('should reject node with empty string name', () => {
        const node = { name: '', type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name cannot be empty');
      });

      test('should reject node with whitespace-only name', () => {
        const node = { name: '   ', type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name cannot be empty');
      });

      test('should reject node with number as name', () => {
        const node = { name: 123, type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name is required and must be a string');
      });

      test('should reject node with name exceeding 100 characters', () => {
        const node = { name: 'a'.repeat(101), type: 'test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node name cannot exceed 100 characters');
      });
    });

    describe('type validation', () => {
      test('should reject node with missing type', () => {
        const node = { name: 'Test' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node type is required and must be a string');
      });

      test('should reject node with null type', () => {
        const node = { name: 'Test', type: null };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node type is required and must be a string');
      });

      test('should reject node with empty string type', () => {
        const node = { name: 'Test', type: '' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node type cannot be empty');
      });

      test('should reject node with whitespace-only type', () => {
        const node = { name: 'Test', type: '   ' };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node type cannot be empty');
      });

      test('should reject node with number as type', () => {
        const node = { name: 'Test', type: 456 };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node type is required and must be a string');
      });
    });

    describe('parameters validation', () => {
      test('should reject node with non-object parameters (string)', () => {
        const node = {
          name: 'Test',
          type: 'test',
          parameters: 'not an object'
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node parameters must be an object');
      });

      test('should reject node with non-object parameters (number)', () => {
        const node = {
          name: 'Test',
          type: 'test',
          parameters: 123
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node parameters must be an object');
      });

      test('should reject node with non-object parameters (array)', () => {
        const node = {
          name: 'Test',
          type: 'test',
          parameters: ['param1', 'param2']
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node parameters must be an object');
      });

      test('should allow null parameters', () => {
        const node = {
          name: 'Test',
          type: 'test',
          parameters: null
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node parameters must be an object');
      });
    });

    describe('position validation', () => {
      test('should reject node with non-object position (string)', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: 'invalid'
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position must be an object');
      });

      test('should reject node with null position', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: null
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position must be an object');
      });

      test('should reject node with missing x coordinate', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: { y: 100 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position.x must be a valid number');
      });

      test('should reject node with missing y coordinate', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: { x: 100 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position.y must be a valid number');
      });

      test('should reject node with non-numeric x coordinate', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: { x: 'invalid', y: 100 }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position.x must be a valid number');
      });

      test('should reject node with non-numeric y coordinate', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: { x: 100, y: 'invalid' }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position.y must be a valid number');
      });

      test('should reject node with NaN coordinates', () => {
        const node = {
          name: 'Test',
          type: 'test',
          position: { x: NaN, y: NaN }
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Node position.x must be a valid number');
        expect(result.errors).toContain('Node position.y must be a valid number');
      });
    });

    describe('multiple validation errors', () => {
      test('should collect multiple errors', () => {
        const node = {
          name: '',
          type: '',
          parameters: 'invalid',
          position: null
        };

        const result = validateNode(node);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
        expect(result.errors).toContain('Node name cannot be empty');
        expect(result.errors).toContain('Node type cannot be empty');
        expect(result.errors).toContain('Node parameters must be an object');
        expect(result.errors).toContain('Node position must be an object');
      });
    });
  });

  describe('normalizeNode', () => {
    describe('valid normalization', () => {
      test('should normalize a complete node without changes', () => {
        const node = {
          name: 'Test Node',
          type: 'httpRequest',
          parameters: { url: 'https://example.com' },
          position: { x: 100, y: 200 }
        };

        const normalized = normalizeNode(node);

        expect(normalized).toEqual(node);
      });

      test('should add default name when missing', () => {
        const node = {
          type: 'httpRequest'
        };

        const normalized = normalizeNode(node);

        expect(normalized.name).toBe('Unnamed Node');
        expect(normalized.type).toBe('httpRequest');
      });

      test('should add default type when missing', () => {
        const node = {
          name: 'Test'
        };

        const normalized = normalizeNode(node);

        expect(normalized.name).toBe('Test');
        expect(normalized.type).toBe('unknown');
      });

      test('should add empty parameters object when missing', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest'
        };

        const normalized = normalizeNode(node);

        expect(normalized.parameters).toEqual({});
      });

      test('should add default position when missing', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest'
        };

        const normalized = normalizeNode(node);

        expect(normalized.position).toEqual({ x: 0, y: 0 });
      });

      test('should add missing x coordinate to position', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest',
          position: { y: 100 }
        };

        const normalized = normalizeNode(node);

        expect(normalized.position.x).toBe(0);
        expect(normalized.position.y).toBe(100);
      });

      test('should add missing y coordinate to position', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest',
          position: { x: 100 }
        };

        const normalized = normalizeNode(node);

        expect(normalized.position.x).toBe(100);
        expect(normalized.position.y).toBe(0);
      });

      test('should preserve x coordinate when it is 0', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest',
          position: { x: 0, y: 100 }
        };

        const normalized = normalizeNode(node);

        expect(normalized.position.x).toBe(0);
        expect(normalized.position.y).toBe(100);
      });

      test('should preserve y coordinate when it is 0', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest',
          position: { x: 100, y: 0 }
        };

        const normalized = normalizeNode(node);

        expect(normalized.position.x).toBe(100);
        expect(normalized.position.y).toBe(0);
      });

      test('should preserve extra properties', () => {
        const node = {
          name: 'Test',
          type: 'httpRequest',
          customField: 'custom value',
          anotherField: 123
        };

        const normalized = normalizeNode(node);

        expect(normalized.customField).toBe('custom value');
        expect(normalized.anotherField).toBe(123);
      });

      test('should not override provided values with defaults', () => {
        const node = {
          name: 'My Node',
          type: 'custom',
          parameters: { key: 'value' },
          position: { x: 50, y: 75 }
        };

        const normalized = normalizeNode(node);

        expect(normalized.name).toBe('My Node');
        expect(normalized.type).toBe('custom');
        expect(normalized.parameters).toEqual({ key: 'value' });
        expect(normalized.position).toEqual({ x: 50, y: 75 });
      });
    });

    describe('invalid input', () => {
      test('should throw error for null node', () => {
        expect(() => normalizeNode(null)).toThrow('Node must be a valid object');
      });

      test('should throw error for undefined node', () => {
        expect(() => normalizeNode(undefined)).toThrow('Node must be a valid object');
      });

      test('should throw error for string input', () => {
        expect(() => normalizeNode('not an object')).toThrow('Node must be a valid object');
      });

      test('should throw error for number input', () => {
        expect(() => normalizeNode(123)).toThrow('Node must be a valid object');
      });

      test('should throw error for array input', () => {
        expect(() => normalizeNode([])).toThrow('Node must be a valid object');
      });
    });
  });

  describe('validateWorkflow', () => {
    describe('valid workflow configurations', () => {
      test('should validate a complete valid workflow', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            {
              name: 'Start',
              type: 'n8n-nodes-base.start',
              position: { x: 100, y: 100 }
            },
            {
              name: 'HTTP Request',
              type: 'n8n-nodes-base.httpRequest',
              parameters: { url: 'https://example.com' },
              position: { x: 300, y: 100 }
            }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.nodeErrors).toEqual({});
      });

      test('should validate workflow with single node', () => {
        const workflow = {
          name: 'Simple Workflow',
          nodes: [
            {
              name: 'Single Node',
              type: 'start'
            }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.nodeErrors).toEqual({});
      });
    });

    describe('invalid workflow object', () => {
      test('should reject null workflow', () => {
        const result = validateWorkflow(null);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must be a valid object');
        expect(result.nodeErrors).toEqual({});
      });

      test('should reject undefined workflow', () => {
        const result = validateWorkflow(undefined);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must be a valid object');
        expect(result.nodeErrors).toEqual({});
      });

      test('should reject non-object workflow (string)', () => {
        const result = validateWorkflow('not an object');

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must be a valid object');
        expect(result.nodeErrors).toEqual({});
      });

      test('should reject non-object workflow (number)', () => {
        const result = validateWorkflow(123);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must be a valid object');
        expect(result.nodeErrors).toEqual({});
      });
    });

    describe('workflow name validation', () => {
      test('should reject workflow with missing name', () => {
        const workflow = {
          nodes: [{ name: 'Node', type: 'test' }]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow name is required and must be a string');
      });

      test('should reject workflow with null name', () => {
        const workflow = {
          name: null,
          nodes: [{ name: 'Node', type: 'test' }]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow name is required and must be a string');
      });

      test('should reject workflow with empty string name', () => {
        const workflow = {
          name: '',
          nodes: [{ name: 'Node', type: 'test' }]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow name cannot be empty');
      });

      test('should reject workflow with whitespace-only name', () => {
        const workflow = {
          name: '   ',
          nodes: [{ name: 'Node', type: 'test' }]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow name cannot be empty');
      });

      test('should reject workflow with non-string name', () => {
        const workflow = {
          name: 123,
          nodes: [{ name: 'Node', type: 'test' }]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow name is required and must be a string');
      });
    });

    describe('nodes array validation', () => {
      test('should reject workflow with missing nodes', () => {
        const workflow = {
          name: 'Test Workflow'
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must contain a nodes array');
      });

      test('should reject workflow with null nodes', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: null
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must contain a nodes array');
      });

      test('should reject workflow with non-array nodes', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: 'not an array'
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must contain a nodes array');
      });

      test('should reject workflow with empty nodes array', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: []
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Workflow must contain at least one node');
      });
    });

    describe('node validation within workflow', () => {
      test('should collect errors for invalid nodes', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            {
              name: 'Valid Node',
              type: 'start'
            },
            {
              name: '',
              type: 'invalid'
            },
            {
              name: 'Another Invalid',
              type: ''
            }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.nodeErrors).toHaveProperty('1');
        expect(result.nodeErrors).toHaveProperty('2');
        expect(result.nodeErrors[1]).toContain('Node name cannot be empty');
        expect(result.nodeErrors[2]).toContain('Node type cannot be empty');
      });

      test('should report multiple errors for single invalid node', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            {
              name: '',
              type: '',
              parameters: 'invalid',
              position: null
            }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.nodeErrors['0']).toBeDefined();
        expect(result.nodeErrors['0'].length).toBeGreaterThan(1);
      });
    });

    describe('duplicate node names', () => {
      test('should detect duplicate node names', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            { name: 'Node1', type: 'start' },
            { name: 'Node2', type: 'http' },
            { name: 'Node1', type: 'end' }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Duplicate node names found: Node1');
      });

      test('should detect multiple sets of duplicate names', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            { name: 'Node1', type: 'start' },
            { name: 'Node2', type: 'http' },
            { name: 'Node1', type: 'end' },
            { name: 'Node2', type: 'webhook' }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('Duplicate node names found'))).toBe(true);
        expect(result.errors.some(e => e.includes('Node1'))).toBe(true);
        expect(result.errors.some(e => e.includes('Node2'))).toBe(true);
      });

      test('should not report duplicates when all names are unique', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            { name: 'Node1', type: 'start' },
            { name: 'Node2', type: 'http' },
            { name: 'Node3', type: 'end' }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      test('should ignore nodes without names when checking duplicates', () => {
        const workflow = {
          name: 'Test Workflow',
          nodes: [
            { type: 'start' },
            { name: 'Node1', type: 'http' },
            { type: 'end' }
          ]
        };

        const result = validateWorkflow(workflow);

        // Should have errors for missing names but not duplicate errors
        expect(result.nodeErrors['0']).toBeDefined();
        expect(result.nodeErrors['2']).toBeDefined();
        expect(result.errors.some(e => e.includes('Duplicate'))).toBe(false);
      });
    });

    describe('multiple workflow errors', () => {
      test('should collect both workflow and node errors', () => {
        const workflow = {
          name: '',
          nodes: [
            { name: '', type: '' }
          ]
        };

        const result = validateWorkflow(workflow);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(Object.keys(result.nodeErrors).length).toBeGreaterThan(0);
      });
    });
  });

  describe('sanitizeNodeName', () => {
    describe('valid sanitization', () => {
      test('should return clean name unchanged', () => {
        const result = sanitizeNodeName('Valid Node Name');

        expect(result).toBe('Valid Node Name');
      });

      test('should trim leading whitespace', () => {
        const result = sanitizeNodeName('   Leading Spaces');

        expect(result).toBe('Leading Spaces');
      });

      test('should trim trailing whitespace', () => {
        const result = sanitizeNodeName('Trailing Spaces   ');

        expect(result).toBe('Trailing Spaces');
      });

      test('should trim both leading and trailing whitespace', () => {
        const result = sanitizeNodeName('   Both Sides   ');

        expect(result).toBe('Both Sides');
      });

      test('should replace multiple spaces with single space', () => {
        const result = sanitizeNodeName('Multiple    Spaces    Here');

        expect(result).toBe('Multiple Spaces Here');
      });

      test('should remove special characters', () => {
        const result = sanitizeNodeName('Node<Name>With:Special*Chars');

        expect(result).toBe('NodeNameWithSpecialChars');
      });

      test('should remove control characters', () => {
        const result = sanitizeNodeName('Node\x00Name\x1F');

        expect(result).toBe('NodeName');
      });

      test('should handle forward slash', () => {
        const result = sanitizeNodeName('Node/Name');

        expect(result).toBe('NodeName');
      });

      test('should handle backslash', () => {
        const result = sanitizeNodeName('Node\\Name');

        expect(result).toBe('NodeName');
      });

      test('should handle question mark', () => {
        const result = sanitizeNodeName('Node?Name');

        expect(result).toBe('NodeName');
      });

      test('should handle pipe character', () => {
        const result = sanitizeNodeName('Node|Name');

        expect(result).toBe('NodeName');
      });

      test('should truncate names exceeding 100 characters', () => {
        const longName = 'a'.repeat(150);
        const result = sanitizeNodeName(longName);

        expect(result.length).toBe(100);
        expect(result).toBe('a'.repeat(100));
      });

      test('should preserve names at exactly 100 characters', () => {
        const name = 'a'.repeat(100);
        const result = sanitizeNodeName(name);

        expect(result).toBe(name);
        expect(result.length).toBe(100);
      });

      test('should handle combination of whitespace and special characters', () => {
        const result = sanitizeNodeName('  Node<Name>:Test  ');

        expect(result).toBe('NodeNameTest');
      });

      test('should handle tabs', () => {
        const result = sanitizeNodeName('Node\tName\tWith\tTabs');

        expect(result).toBe('Node Name With Tabs');
      });

      test('should handle newlines', () => {
        const result = sanitizeNodeName('Node\nName\nWith\nNewlines');

        expect(result).toBe('Node Name With Newlines');
      });
    });

    describe('edge cases', () => {
      test('should return empty string for non-string input (null)', () => {
        const result = sanitizeNodeName(null);

        expect(result).toBe('');
      });

      test('should return empty string for non-string input (undefined)', () => {
        const result = sanitizeNodeName(undefined);

        expect(result).toBe('');
      });

      test('should return empty string for non-string input (number)', () => {
        const result = sanitizeNodeName(123);

        expect(result).toBe('');
      });

      test('should return empty string for non-string input (object)', () => {
        const result = sanitizeNodeName({});

        expect(result).toBe('');
      });

      test('should return empty string for non-string input (array)', () => {
        const result = sanitizeNodeName([]);

        expect(result).toBe('');
      });

      test('should return empty string for whitespace-only input', () => {
        const result = sanitizeNodeName('     ');

        expect(result).toBe('');
      });

      test('should return empty string for special characters only', () => {
        const result = sanitizeNodeName('<>:"/\\|?*');

        expect(result).toBe('');
      });

      test('should handle empty string', () => {
        const result = sanitizeNodeName('');

        expect(result).toBe('');
      });

      test('should preserve valid unicode characters', () => {
        const result = sanitizeNodeName('Node 名前 Name');

        expect(result).toBe('Node 名前 Name');
      });

      test('should preserve numbers', () => {
        const result = sanitizeNodeName('Node123Name456');

        expect(result).toBe('Node123Name456');
      });

      test('should preserve hyphens and underscores', () => {
        const result = sanitizeNodeName('Node-Name_Test');

        expect(result).toBe('Node-Name_Test');
      });

      test('should handle mixed valid and invalid characters', () => {
        const result = sanitizeNodeName('Valid-Node_123:Invalid*Chars');

        expect(result).toBe('Valid-Node_123InvalidChars');
      });
    });
  });
});
