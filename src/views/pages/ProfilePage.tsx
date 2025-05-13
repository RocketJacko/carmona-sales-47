import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Card className="shadow-lg border-none rounded-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Contenido de la página de perfil</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
