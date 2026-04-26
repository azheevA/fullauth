import * as React from 'react';
import {
  Body,
  Container,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
  Head,
} from '@react-email/components';

interface TwoFactoryTemplateProps {
  token: string;
}

export function TwoFactoryTemplate({ token }: TwoFactoryTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-12 max-w-md rounded-xl bg-white p-8 shadow-md">
            <Heading className="text-center text-2xl font-semibold text-gray-900">
              Двухфакторная аутентификация
            </Heading>

            <Text className="mt-4 text-sm leading-6 text-gray-600">
              Ваш код двухфакторной аутентификации:<span>{token}</span>
            </Text>

            <Section className="my-6 text-center"></Section>

            <Text className="text-xs leading-5 text-gray-500">
              Пожалуйста, введите этот код в приложении для завершения процесса
              аутентификации
            </Text>
            <Text className="text-xs leading-5 text-gray-500">
              Если вы не запрашивали этот код, просто проигнорируйте это
              сообщение.
            </Text>
            <Text className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Ваш сервис
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
