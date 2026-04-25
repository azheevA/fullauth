import * as React from 'react';
import {
  Body,
  Container,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
  Head,
} from '@react-email/components';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-12 max-w-md rounded-xl bg-white p-8 shadow-md">
            <Heading className="text-center text-2xl font-semibold text-gray-900">
              Сброс пароля
            </Heading>

            <Text className="mt-4 text-sm leading-6 text-gray-600">
              Вы запросили сброс пароля. Нажмите кнопку ниже, чтобы задать новый
              пароль.
            </Text>

            <Section className="my-6 text-center">
              <Link
                href={resetLink}
                className="inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white no-underline"
              >
                Сбросить пароль
              </Link>
            </Section>

            <Text className="text-xs leading-5 text-gray-500">
              Ссылка действительна в течение 1 часа. Если вы не запрашивали
              сброс пароля, просто проигнорируйте это письмо.
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
