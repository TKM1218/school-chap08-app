"use client";

import { useState } from "react";
import { sendContact, type ContactPayload } from "@/src/api/posts";

type ContactFormValues = {
  name: string;
  email: string;
  content: string;
};

type FormErrors = {
  name: string;
  email: string;
  content: string;
};

export default function Contact() {
  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: "",
    email: "",
    content: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    content: "",
  });

  // 送信中ボタン無効化のためのステータス
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = () => {
    const nextErrors: FormErrors = {
      name: "",
      email: "",
      content: "",
    };

    if (!formValues.name) {
      nextErrors.name = "お名前は必須です。";
    } else if (formValues.name.length > 30) {
      nextErrors.name = "お名前は30文字以内で入力してください。";
    }

    if (!formValues.email) {
      nextErrors.email = "メールアドレスは必須です。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = "メールアドレスの形式が正しくありません。";
    }

    if (!formValues.content) {
      nextErrors.content = "本文は必須です。";
    } else if (formValues.content.length > 500) {
      nextErrors.content = "本文は500文字以内で入力してください。";
    }

    setErrors(nextErrors);

    return !nextErrors.name && !nextErrors.email && !nextErrors.content;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    if (isSubmitting) return; // 二重送信防止

    setFormValues({
      name: "",
      email: "",
      content: "",
    });

    setErrors({
      name: "",
      email: "",
      content: "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return; // 二重送信防止
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const payload: ContactPayload = {
        name: formValues.name,
        email: formValues.email,
        content: formValues.content,
      };

      await sendContact(payload);
      alert("送信しました。");
      handleClear();
    } catch (e) {
      const message = e instanceof Error ? e.message : "エラーが発生しました";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <h1 className="mb-8 text-2xl font-bold">お問い合わせ</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            お名前
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            required
            maxLength={30}
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            本文
          </label>

          <textarea
            id="content"
            name="content"
            value={formValues.content}
            onChange={handleChange}
            required
            maxLength={500}
            rows={6}
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
          />

          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gray-900 px-6 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            送信
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="rounded-md bg-gray-300 px-6 py-2 text-sm font-bold text-gray-800 hover:opacity-90 disabled:opacity-60"
          >
            クリア
          </button>
        </div>
      </form>
    </main>
  );
}
