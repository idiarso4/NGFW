'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';
import type { FirewallRule, NetworkAddress, Service } from '@/types';
import {
  X,
  Shield,
  AlertCircle,
  Info,
  Plus,
  Minus,
} from 'lucide-react';

interface FirewallRuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Partial<FirewallRule>) => void;
  rule?: FirewallRule;
  mode?: 'create' | 'edit';
}

export function FirewallRuleForm({ 
  isOpen, 
  onClose, 
  onSave, 
  rule, 
  mode = 'create' 
}: FirewallRuleFormProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    enabled: rule?.enabled ?? true,
    priority: rule?.priority || 100,
    sourceType: rule?.source.type || 'any',
    sourceValue: rule?.source.value || '',
    destinationType: rule?.destination.type || 'any',
    destinationValue: rule?.destination.value || '',
    serviceType: rule?.service.type || 'any',
    servicePorts: rule?.service.ports || '',
    serviceProtocol: rule?.service.protocol || '',
    action: rule?.action || 'allow',
    schedule: rule?.schedule?.type || 'always',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (formData.priority < 1 || formData.priority > 1000) {
      newErrors.priority = 'Priority must be between 1 and 1000';
    }

    if (formData.sourceType !== 'any' && !formData.sourceValue.trim()) {
      newErrors.sourceValue = 'Source value is required';
    }

    if (formData.destinationType !== 'any' && !formData.destinationValue.trim()) {
      newErrors.destinationValue = 'Destination value is required';
    }

    if ((formData.serviceType === 'tcp' || formData.serviceType === 'udp') && !formData.servicePorts.trim()) {
      newErrors.servicePorts = 'Port specification is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newRule: Partial<FirewallRule> = {
      name: formData.name,
      description: formData.description,
      enabled: formData.enabled,
      priority: formData.priority,
      source: {
        type: formData.sourceType as NetworkAddress['type'],
        value: formData.sourceType === 'any' ? 'any' : formData.sourceValue,
      },
      destination: {
        type: formData.destinationType as NetworkAddress['type'],
        value: formData.destinationType === 'any' ? 'any' : formData.destinationValue,
      },
      service: {
        type: formData.serviceType as Service['type'],
        ports: formData.servicePorts || undefined,
        protocol: formData.serviceProtocol || undefined,
      },
      action: formData.action as 'allow' | 'deny' | 'drop',
    };

    onSave(newRule);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {mode === 'create' ? 'Create Firewall Rule' : 'Edit Firewall Rule'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure network security rule and policy
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white',
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                  )}
                  placeholder="Enter rule name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority *
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white',
                    errors.priority 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                  )}
                />
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.priority}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher numbers = higher priority (1-1000)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Optional description for this rule"
              />
            </div>

            {/* Source Configuration */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Source Configuration
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source Type
                  </label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => handleInputChange('sourceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="any">Any</option>
                    <option value="single">Single IP</option>
                    <option value="range">IP Range</option>
                    <option value="subnet">Subnet</option>
                    <option value="group">Address Group</option>
                  </select>
                </div>
                {formData.sourceType !== 'any' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source Value *
                    </label>
                    <input
                      type="text"
                      value={formData.sourceValue}
                      onChange={(e) => handleInputChange('sourceValue', e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white',
                        errors.sourceValue 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                      )}
                      placeholder={
                        formData.sourceType === 'single' ? '192.168.1.100' :
                        formData.sourceType === 'range' ? '192.168.1.1-192.168.1.100' :
                        formData.sourceType === 'subnet' ? '192.168.1.0/24' :
                        'group-name'
                      }
                    />
                    {errors.sourceValue && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.sourceValue}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Destination Configuration */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="h-4 w-4 mr-2 text-green-500" />
                Destination Configuration
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination Type
                  </label>
                  <select
                    value={formData.destinationType}
                    onChange={(e) => handleInputChange('destinationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="any">Any</option>
                    <option value="single">Single IP</option>
                    <option value="range">IP Range</option>
                    <option value="subnet">Subnet</option>
                    <option value="group">Address Group</option>
                  </select>
                </div>
                {formData.destinationType !== 'any' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destination Value *
                    </label>
                    <input
                      type="text"
                      value={formData.destinationValue}
                      onChange={(e) => handleInputChange('destinationValue', e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white',
                        errors.destinationValue 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                      )}
                      placeholder={
                        formData.destinationType === 'single' ? '10.0.0.1' :
                        formData.destinationType === 'range' ? '10.0.0.1-10.0.0.100' :
                        formData.destinationType === 'subnet' ? '10.0.0.0/24' :
                        'group-name'
                      }
                    />
                    {errors.destinationValue && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.destinationValue}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Service Configuration */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="h-4 w-4 mr-2 text-purple-500" />
                Service Configuration
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="any">Any</option>
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="icmp">ICMP</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {(formData.serviceType === 'tcp' || formData.serviceType === 'udp') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ports *
                    </label>
                    <input
                      type="text"
                      value={formData.servicePorts}
                      onChange={(e) => handleInputChange('servicePorts', e.target.value)}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 dark:bg-gray-700 dark:text-white',
                        errors.servicePorts 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                      )}
                      placeholder="80, 443, 8000-8080"
                    />
                    {errors.servicePorts && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.servicePorts}
                      </p>
                    )}
                  </div>
                )}
                {formData.serviceType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Protocol
                    </label>
                    <input
                      type="text"
                      value={formData.serviceProtocol}
                      onChange={(e) => handleInputChange('serviceProtocol', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Custom protocol name"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Action *
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => handleInputChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                  <option value="drop">Drop</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => handleInputChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Enable this rule immediately
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {mode === 'create' ? 'Create Rule' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
