/**
 * Validates and normalizes n8n workflow node configurations
 * @module nodeValidator
 */

/**
 * Validates a node configuration object
 * @param {Object} node - The node configuration to validate
 * @param {string} node.name - The name of the node
 * @param {string} node.type - The type of the node
 * @param {Object} node.parameters - The parameters of the node
 * @param {Object} node.position - The position of the node (x, y coordinates)
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateNode(node) {
  const errors = [];

  // Check if node exists
  if (!node || typeof node !== 'object') {
    return {
      isValid: false,
      errors: ['Node must be a valid object']
    };
  }

  // Validate name
  if (!node.name || typeof node.name !== 'string') {
    errors.push('Node name is required and must be a string');
  } else if (node.name.trim().length === 0) {
    errors.push('Node name cannot be empty');
  } else if (node.name.length > 100) {
    errors.push('Node name cannot exceed 100 characters');
  }

  // Validate type
  if (!node.type || typeof node.type !== 'string') {
    errors.push('Node type is required and must be a string');
  } else if (node.type.trim().length === 0) {
    errors.push('Node type cannot be empty');
  }

  // Validate parameters
  if (node.parameters !== undefined && typeof node.parameters !== 'object') {
    errors.push('Node parameters must be an object');
  }

  // Validate position
  if (node.position !== undefined) {
    if (typeof node.position !== 'object' || node.position === null) {
      errors.push('Node position must be an object');
    } else {
      if (typeof node.position.x !== 'number' || isNaN(node.position.x)) {
        errors.push('Node position.x must be a valid number');
      }
      if (typeof node.position.y !== 'number' || isNaN(node.position.y)) {
        errors.push('Node position.y must be a valid number');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Normalizes a node configuration by adding default values
 * @param {Object} node - The node configuration to normalize
 * @returns {Object} Normalized node configuration
 */
function normalizeNode(node) {
  if (!node || typeof node !== 'object') {
    throw new Error('Node must be a valid object');
  }

  const normalized = {
    name: node.name || 'Unnamed Node',
    type: node.type || 'unknown',
    parameters: node.parameters || {},
    position: node.position || { x: 0, y: 0 },
    ...node
  };

  // Ensure position has both x and y
  if (!normalized.position.x && normalized.position.x !== 0) {
    normalized.position.x = 0;
  }
  if (!normalized.position.y && normalized.position.y !== 0) {
    normalized.position.y = 0;
  }

  return normalized;
}

/**
 * Validates a workflow configuration containing multiple nodes
 * @param {Object} workflow - The workflow configuration
 * @param {Array} workflow.nodes - Array of node configurations
 * @param {string} workflow.name - The name of the workflow
 * @returns {Object} Validation result with isValid flag, errors array, and nodeErrors object
 */
function validateWorkflow(workflow) {
  const errors = [];
  const nodeErrors = {};

  // Check if workflow exists
  if (!workflow || typeof workflow !== 'object') {
    return {
      isValid: false,
      errors: ['Workflow must be a valid object'],
      nodeErrors: {}
    };
  }

  // Validate workflow name
  if (!workflow.name || typeof workflow.name !== 'string') {
    errors.push('Workflow name is required and must be a string');
  } else if (workflow.name.trim().length === 0) {
    errors.push('Workflow name cannot be empty');
  }

  // Validate nodes array
  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    errors.push('Workflow must contain a nodes array');
  } else {
    if (workflow.nodes.length === 0) {
      errors.push('Workflow must contain at least one node');
    }

    // Validate each node
    workflow.nodes.forEach((node, index) => {
      const validation = validateNode(node);
      if (!validation.isValid) {
        nodeErrors[index] = validation.errors;
      }
    });

    // Check for duplicate node names
    const nodeNames = workflow.nodes.map(node => node.name).filter(name => name);
    const duplicates = nodeNames.filter((name, index) => nodeNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate node names found: ${[...new Set(duplicates)].join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0 && Object.keys(nodeErrors).length === 0,
    errors,
    nodeErrors
  };
}

/**
 * Sanitizes node name by removing invalid characters
 * @param {string} name - The node name to sanitize
 * @returns {string} Sanitized node name
 */
function sanitizeNodeName(name) {
  if (typeof name !== 'string') {
    return '';
  }

  // Remove leading/trailing whitespace
  let sanitized = name.trim();

  // Replace multiple spaces with single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Remove special characters that might cause issues
  sanitized = sanitized.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');

  // Truncate to max length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  return sanitized;
}

module.exports = {
  validateNode,
  normalizeNode,
  validateWorkflow,
  sanitizeNodeName
};
