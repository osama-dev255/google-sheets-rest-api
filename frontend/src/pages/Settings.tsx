import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Building, 
  Bell, 
  Shield, 
  Printer,
  Database,
  FileText,
  Wrench
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useReceiptSettings } from '@/contexts/ReceiptSettingsContext';

export function Settings() {
  const { settings, updateSettings } = useReceiptSettings();
  const navigate = useNavigate();
  
  const [businessName, setBusinessName] = useState('Business Project Tanzania');
  const [businessAddress, setBusinessAddress] = useState('123 Business Street, Dar es Salaam, Tanzania');
  const [businessPhone, setBusinessPhone] = useState('+255 123 456 789');
  const [businessEmail, setBusinessEmail] = useState('info@businessproject.co.tz');
  const [currency, setCurrency] = useState('TSh');
  const [taxRate, setTaxRate] = useState('18.0');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for your business!');
  const [notifications, setNotifications] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [printerEnabled, setPrinterEnabled] = useState(true);
  
  const { toast } = useToast();

  // Load receipt settings from context
  useEffect(() => {
    setReceiptFooter(settings.footer);
  }, [settings.footer]);

  const handleSave = () => {
    // In a real app, this would save to a database or API
    console.log('Saving settings...', {
      businessName,
      businessAddress,
      businessPhone,
      businessEmail,
      currency,
      taxRate,
      receiptFooter,
      notifications,
      lowStockAlert,
      printerEnabled
    });
    
    // Save receipt settings to context
    updateSettings({
      footer: receiptFooter
    });
    
    // Show success message
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const goToAuthDiagnostics = () => {
    navigate('/auth-diagnostics');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Business Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Address</Label>
                <Input
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Financial Settings
              </CardTitle>
              <CardDescription>
                Configure currency, tax rates, and financial preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TSh">TSh (Tanzanian Shilling)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer</Label>
                <Input
                  id="receiptFooter"
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Authentication Diagnostics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5" />
                Authentication Diagnostics
              </CardTitle>
              <CardDescription>
                Troubleshoot login issues and diagnose authentication problems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If some users registered in Sheet1 cannot log in, use the diagnostics tool to identify and resolve issues.
              </p>
              <Button onClick={goToAuthDiagnostics} className="w-full">
                Run Authentication Diagnostics
              </Button>
            </CardContent>
          </Card>

          {/* Receipt Template Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Receipt Template
              </CardTitle>
              <CardDescription>
                Customize the appearance of your sales receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiptHeader">Receipt Header</Label>
                <Input
                  id="receiptHeader"
                  value={settings.header}
                  onChange={(e) => updateSettings({ header: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptAddressLine1">Address Line 1</Label>
                <Input
                  id="receiptAddressLine1"
                  value={settings.addressLine1}
                  onChange={(e) => updateSettings({ addressLine1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptAddressLine2">Address Line 2</Label>
                <Input
                  id="receiptAddressLine2"
                  value={settings.addressLine2}
                  onChange={(e) => updateSettings({ addressLine2: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptPaymentMethod">Default Payment Method</Label>
                <Input
                  id="receiptPaymentMethod"
                  value={settings.paymentMethod}
                  onChange={(e) => updateSettings({ paymentMethod: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Tax Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display tax details on receipts
                  </p>
                </div>
                <Switch
                  checked={settings.showTax}
                  onCheckedChange={(checked) => updateSettings({ showTax: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Discount Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display discount details on receipts
                  </p>
                </div>
                <Switch
                  checked={settings.showDiscounts}
                  onCheckedChange={(checked) => updateSettings({ showDiscounts: checked })}
                />
              </div>
              
              {/* Receipt Preview */}
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Receipt Preview</h3>
                <div className="text-xs space-y-1">
                  <div className="text-center border-b pb-2">
                    <div className="font-bold">{settings.header}</div>
                    <div>{settings.addressLine1}</div>
                    <div>{settings.addressLine2}</div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Receipt #: TXN-001</span>
                    <span>2025-01-01 10:30</span>
                  </div>
                  <div className="border-t border-b py-2 my-2">
                    <div className="flex justify-between">
                      <div>
                        <div>Product Name</div>
                        <div className="ml-2">x2</div>
                        {settings.showDiscounts && (
                          <div className="ml-2 text-red-500">(-1000)</div>
                        )}
                      </div>
                      <div>20000</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>20000</span>
                    </div>
                    {settings.showTax && (
                      <div className="flex justify-between">
                        <span>Tax (18%):</span>
                        <span>3600</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Total:</span>
                      <span>23600</span>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-xs">
                    <p>Payment Method: {settings.paymentMethod}</p>
                    <p className="mt-1">{settings.footer}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch
                  checked={lowStockAlert}
                  onCheckedChange={setLowStockAlert}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hardware Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Printer className="mr-2 h-5 w-5" />
                Hardware
              </CardTitle>
              <CardDescription>
                Configure hardware settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Receipt Printer</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically print receipts after sales
                  </p>
                </div>
                <Switch
                  checked={printerEnabled}
                  onCheckedChange={setPrinterEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage security settings and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}