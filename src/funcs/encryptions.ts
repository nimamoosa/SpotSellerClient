import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

type Status = "success" | "error";

const generateIV = (): Buffer => {
  return randomBytes(16);
};

function encrypt(text: string, secret: string): string {
  const iv = generateIV();
  const key = secret;

  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(
  encryptedData: string,
  secret: string
): { status: Status; message: string } {
  try {
    const parts = encryptedData.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = Buffer.from(parts[1], "hex");

    const key = secret;

    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return {
      status: "success",
      message: decrypted.toString("utf8"),
    };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

const encryptJet = (text: string, secret: string): string => {
  const iv = randomBytes(12);
  const key = Buffer.from(secret, "base64").toString("base64");

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();
  return (
    iv.toString("hex") +
    ":" +
    encrypted.toString("hex") +
    ":" +
    authTag.toString("hex")
  );
};

const decryptJet = (
  encryptedData: string,
  secret: string
): { status: Status; message: string } => {
  try {
    const [ivHex, encryptedHex, authTagHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = Buffer.from(secret, "base64").toString("base64");

    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return { status: "success", message: decrypted.toString("utf8") };
  } catch (error) {
    return { status: "error", message: error as string };
  }
};

export {
  encrypt as Enc,
  decrypt as Dec,
  encryptJet as EncJET,
  decryptJet as DecJET,
};
