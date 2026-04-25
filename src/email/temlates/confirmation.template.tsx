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
} from '@react-email/components';
interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}
export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  return (
    <Tailwind>
      <Html>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <Heading className="text-center text-2xl font-bold text-gray-900">
              Подтверждение почты
            </Heading>

            <Text className="mt-4 text-sm text-gray-600">
              Привет! Чтобы подтвердить свой адрес электронной почты,
              пожалуйста, перейдите по ссылке ниже:
            </Text>

            <Section className="my-6 text-center">
              <Link
                href={confirmLink}
                className="inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white no-underline"
              >
                Подтвердить почту
              </Link>
            </Section>

            <Text className="text-xs text-gray-500">
              Эта ссылка действительна в течение 1 часа. Если вы не запрашивали
              подтверждение, просто проигнорируйте это сообщение.
            </Text>

            <Text className="mt-6 text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} Ваш сервис
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
