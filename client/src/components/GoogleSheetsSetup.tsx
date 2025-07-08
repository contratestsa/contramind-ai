import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/useLanguage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function GoogleSheetsSetup() {
  const { language } = useLanguage();
  const [credentials, setCredentials] = useState('');
  const queryClient = useQueryClient();

  const initMutation = useMutation({
    mutationFn: (data: { credentials: any }) => 
      apiRequest('/api/google-sheets/init', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/google-sheets/status'] });
      setCredentials('');
    }
  });

  const handleSubmit = () => {
    if (!credentials.trim()) return;
    
    try {
      const parsedCreds = JSON.parse(credentials);
      initMutation.mutate({ credentials: parsedCreds });
    } catch (error) {
      alert(language === 'ar' ? 
        'بيانات الاعتماد غير صالحة. يرجى التأكد من أنها بتنسيق JSON صحيح.' : 
        'Invalid credentials. Please ensure they are in valid JSON format.');
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {language === 'ar' ? 'إعداد Google Sheets' : 'Google Sheets Setup'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? 
            'الصق بيانات اعتماد حساب خدمة Google الخاص بك هنا للاتصال بـ Google Sheets' : 
            'Paste your Google service account credentials here to connect to Google Sheets'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === 'ar' ? 'بيانات اعتماد حساب الخدمة (JSON)' : 'Service Account Credentials (JSON)'}
          </label>
          <Textarea
            placeholder={language === 'ar' ? 
              'الصق بيانات اعتماد JSON هنا...' : 
              'Paste JSON credentials here...'}
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            className="font-mono text-sm h-48"
          />
        </div>

        {initMutation.isError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' ? 
                'فشل الاتصال بـ Google Sheets. يرجى التحقق من بيانات الاعتماد.' : 
                'Failed to connect to Google Sheets. Please check your credentials.'}
            </AlertDescription>
          </Alert>
        )}

        {initMutation.isSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {language === 'ar' ? 
                'تم الاتصال بـ Google Sheets بنجاح!' : 
                'Successfully connected to Google Sheets!'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">
            {language === 'ar' ? 'كيفية الحصول على بيانات الاعتماد:' : 'How to get credentials:'}
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{language === 'ar' ? 
              'انتقل إلى Google Cloud Console' : 
              'Go to Google Cloud Console'}</li>
            <li>{language === 'ar' ? 
              'أنشئ مشروعًا جديدًا أو حدد مشروعًا موجودًا' : 
              'Create a new project or select an existing one'}</li>
            <li>{language === 'ar' ? 
              'مكّن Google Sheets API' : 
              'Enable Google Sheets API'}</li>
            <li>{language === 'ar' ? 
              'أنشئ حساب خدمة وقم بتنزيل مفتاح JSON' : 
              'Create a service account and download the JSON key'}</li>
            <li>{language === 'ar' ? 
              'شارك جدول البيانات الخاص بك مع البريد الإلكتروني لحساب الخدمة' : 
              'Share your spreadsheet with the service account email'}</li>
          </ol>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!credentials.trim() || initMutation.isPending}
          className="w-full"
        >
          {initMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {language === 'ar' ? 'الاتصال بـ Google Sheets' : 'Connect to Google Sheets'}
        </Button>
      </CardContent>
    </Card>
  );
}