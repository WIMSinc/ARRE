import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RefreshCw, 
  Building, 
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandingConfig {
  id: string;
  agencyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  customCSS?: string;
  footerText: string;
  isActive: boolean;
}

const CustomBrandingSystem = () => {
  const [currentBranding, setCurrentBranding] = useState<BrandingConfig>({
    id: 'brand_001',
    agencyName: 'Premier Commercial Realty',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    logoUrl: '',
    tagline: 'Transforming Commercial Real Estate with Innovation',
    contactEmail: 'info@premiercommercial.com',
    contactPhone: '(555) 123-4567',
    website: 'www.premiercommercial.com',
    address: '123 Business Center Drive, Suite 400, Metro City, CA 90210',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/premier-commercial',
      twitter: 'https://twitter.com/premiercommercial',
      facebook: 'https://facebook.com/premiercommercial'
    },
    footerText: 'Copyright © 2024 Premier Commercial Realty. All rights reserved.',
    isActive: true
  });

  const [presetBrandings] = useState<BrandingConfig[]>([
    {
      id: 'preset_luxury',
      agencyName: 'Luxury Commercial Group',
      primaryColor: '#1f2937',
      secondaryColor: '#d4af37',
      accentColor: '#374151',
      tagline: 'Exclusive Commercial Properties for Discerning Clients',
      contactEmail: 'contact@luxurycommercial.com',
      contactPhone: '(555) 987-6543',
      website: 'www.luxurycommercial.com',
      address: '456 Elite Business Plaza, Prestige City, NY 10001',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/luxury-commercial',
        instagram: 'https://instagram.com/luxurycommercial'
      },
      footerText: 'Luxury Commercial Group - Excellence in Commercial Real Estate',
      isActive: false
    },
    {
      id: 'preset_modern',
      agencyName: 'NextGen Properties',
      primaryColor: '#7c3aed',
      secondaryColor: '#06b6d4',
      accentColor: '#f59e0b',
      tagline: 'Future-Forward Commercial Real Estate Solutions',
      contactEmail: 'hello@nextgenproperties.com',
      contactPhone: '(555) 456-7890',
      website: 'www.nextgenproperties.com',
      address: '789 Innovation Way, Tech District, TX 75201',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/nextgen-properties',
        twitter: 'https://twitter.com/nextgenprops',
        instagram: 'https://instagram.com/nextgenproperties'
      },
      footerText: 'NextGen Properties - Powered by Technology',
      isActive: false
    }
  ]);

  const { toast } = useToast();

  const handleInputChange = (field: keyof BrandingConfig, value: string) => {
    setCurrentBranding(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setCurrentBranding(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const saveBranding = () => {
    toast({
      title: "Branding Saved",
      description: "Your custom branding has been applied successfully!",
    });
  };

  const applyPreset = (preset: BrandingConfig) => {
    setCurrentBranding({
      ...preset,
      id: currentBranding.id,
      isActive: true
    });
    toast({
      title: "Preset Applied",
      description: `${preset.agencyName} branding has been applied`,
    });
  };

  const resetToDefault = () => {
    setCurrentBranding({
      id: 'brand_001',
      agencyName: 'AugmentedRealityRE',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#10b981',
      logoUrl: '',
      tagline: 'Commercial Real Estate Visualization Platform',
      contactEmail: 'info@augmentedrealityre.com',
      contactPhone: '(555) 123-4567',
      website: 'www.augmentedrealityre.com',
      address: '123 Innovation Drive, Tech City, CA 90210',
      socialLinks: {},
      footerText: 'Copyright © 2024 AugmentedRealityRE. All rights reserved.',
      isActive: true
    });
  };

  const exportBranding = () => {
    toast({
      title: "Branding Exported",
      description: "Branding configuration has been exported as JSON",
    });
  };

  return (
    <div className="space-y-6">
      {/* Branding Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Custom Branding System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize the platform appearance for your real estate agency
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                Active: {currentBranding.agencyName}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportBranding} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={resetToDefault} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={saveBranding} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding Configuration */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input
                  id="agencyName"
                  value={currentBranding.agencyName}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  placeholder="Enter your agency name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={currentBranding.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Your agency's tagline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUpload">Logo Upload</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={currentBranding.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={currentBranding.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={currentBranding.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={currentBranding.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={currentBranding.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={currentBranding.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={currentBranding.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@agency.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={currentBranding.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={currentBranding.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.agency.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={currentBranding.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your business address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={currentBranding.socialLinks.linkedin || ''}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/agency"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={currentBranding.socialLinks.twitter || ''}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/agency"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={currentBranding.socialLinks.facebook || ''}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/agency"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={currentBranding.socialLinks.instagram || ''}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/agency"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Presets */}
        <div className="space-y-6">
          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-96"
                style={{ 
                  borderColor: currentBranding.primaryColor + '40',
                  background: `linear-gradient(135deg, ${currentBranding.primaryColor}10, ${currentBranding.accentColor}10)`
                }}
              >
                {/* Mock Header */}
                <div 
                  className="p-4 rounded-lg mb-4 text-white"
                  style={{ backgroundColor: currentBranding.primaryColor }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">{currentBranding.agencyName}</h2>
                      <p className="text-sm opacity-90">{currentBranding.tagline}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h3 className="font-semibold mb-2">Featured Property</h3>
                    <div className="flex gap-2 mb-3">
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: currentBranding.primaryColor }}
                      >
                        View in VR
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{ 
                          borderColor: currentBranding.accentColor,
                          color: currentBranding.accentColor
                        }}
                      >
                        Schedule Tour
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Experience immersive property tours with our VR technology
                    </div>
                  </div>

                  {/* Mock Contact Card */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="text-sm space-y-1">
                      <div>{currentBranding.contactEmail}</div>
                      <div>{currentBranding.contactPhone}</div>
                      <div>{currentBranding.website}</div>
                    </div>
                  </div>
                </div>

                {/* Mock Footer */}
                <div 
                  className="mt-6 p-3 rounded text-center text-sm"
                  style={{ 
                    backgroundColor: currentBranding.secondaryColor + '20',
                    color: currentBranding.secondaryColor
                  }}
                >
                  {currentBranding.footerText}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Brandings */}
          <Card>
            <CardHeader>
              <CardTitle>Preset Brandings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {presetBrandings.map((preset) => (
                  <div key={preset.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{preset.agencyName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {preset.tagline}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => applyPreset(preset)}
                      >
                        Apply
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: preset.primaryColor }}
                        title="Primary Color"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: preset.secondaryColor }}
                        title="Secondary Color"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: preset.accentColor }}
                        title="Accent Color"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  value={currentBranding.customCSS || ''}
                  onChange={(e) => handleInputChange('customCSS', e.target.value)}
                  placeholder="/* Custom CSS rules */"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={currentBranding.footerText}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                  placeholder="Copyright notice and agency info"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomBrandingSystem;