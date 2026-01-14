import Card from "./components/ui/VhsCard";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Form, UseAuthReturn, UserLogin, UserSignUp } from "./types/user.types";

const validateEmail = (email: string): string | null => {
    if (!email || email.trim().length === 0) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
};

const validatePassword = (password: string): string | null => {
    if (!password || password.length === 0) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
};

const validateUsername = (username: string): string | null => {
    if (!username || username.trim().length === 0) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
};

function DoubleAuthentificacte({ auth }: {
    auth: UseAuthReturn
}) {
    const [code, setCode] = useState("");
    const { t } = useTranslation()
    return (
        <Card className="flex flex-col items-center gap-5 bg-[rgba(10,10,10,0.9)] border border-[#33ff00] p-[40px_50px] shadow-[0_0_40px_rgba(0,0,0,1),6px_6px_0px_rgba(51,255,0,0.2)] w-[400px] z-[60]">
            <div className="text-2xl mb-5 uppercase border-b-2 border-[#33ff00] pb-2.5 w-full text-center tracking-[2px] animate-text-flicker">AUTH REQUIRED</div>
            <div className="w-full flex flex-col gap-1.5 font-mono">
                <div className="text-[0.9rem] opacity-80">CODE {'>'}</div>
                <input
                    name="Code"
                    placeholder="000000"
                    maxLength={6}
                    className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 outline-none shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full box-border focus:shadow-[inset_0_0_15px_rgba(51,255,0,0.3)] focus:bg-[#051a05] text-center tracking-widest"
                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")) }}
                />
            </div>
            <div className="flex gap-5 w-full mt-2.5">
                <button
                    className="font-mono font-bold text-[1.1rem] uppercase bg-black py-2 px-4 border cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 border-[#2a9d8f] text-[#2a9d8f] hover:bg-[#2a9d8f] hover:text-black"
                    onClick={() => { auth.SetProfilPage(false); auth.setDoubleAuthPage(false) }}
                >
                    {t("doubleAuthentificate.cancel")}
                </button>
                <button
                    className="font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5"
                    onClick={() => { if (code.length === 6) auth.sendCode(code) }}
                >
                    {t("doubleAuthentificate.verify")}
                </button>
            </div>
        </Card>
    )
}

function AuthBody({ auth, choiceForm, setChoiceForm }
    : {
        auth: UseAuthReturn;
        choiceForm: number,
        setChoiceForm: (value: number) => void,
    }) {
    const { t } = useTranslation()
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const formuse: [Form<UserLogin>, Form<UserSignUp>] = [
        {
            data: (({ isTwoFactorEnabled, username, ...rest }) => rest)(auth.signupForm),
            txt: "NO SIGNAL? [ INITIALIZE ]",
            title: "AUTHENTICATION"
        },
        {
            data: (({ isTwoFactorEnabled, ...rest }) => rest)(auth.signupForm),
            txt: "HAS ID? [ LOGIN ]",
            title: "NEW USER PROTOCOL"
        }
    ];

    const validateField = (key: string, value: string): string | null => {
        if (key === "email") return validateEmail(value);
        if (key === "password") return validatePassword(value);
        if (key === "username") return validateUsername(value);
        return null;
    };

    const handleChange = (key: string, value: string) => {
        auth.SetSignUpForm({ ...auth.signupForm, [key]: value });
        if (touched[key]) {
            setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
        }
    };

    const handleBlur = (key: string, value: string) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    };

    const validateAll = (): boolean => {
        const currentData = formuse[choiceForm].data;
        const newErrors: Record<string, string | null> = {};
        let isValid = true;

        Object.entries(currentData).forEach(([key, value]) => {
            if (key !== "name") {
                const error = validateField(key, value as string);
                newErrors[key] = error;
                if (error) isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(currentData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateAll()) return;

        if (choiceForm === 1) {
            auth.sendSignUp();
        } else {
            auth.sendLogin();
        }
    };

    // Reset errors when switching forms
    useEffect(() => {
        setErrors({});
        setTouched({});
    }, [choiceForm]);

    const hasErrors = Object.values(errors).some(e => e !== null);

    return (
        <Card className="flex flex-col items-center gap-5 bg-[rgba(10,10,10,0.9)] border border-[#33ff00] p-[40px_50px] shadow-[0_0_40px_rgba(0,0,0,1),6px_6px_0px_rgba(51,255,0,0.2)] w-[400px] z-[60]">
            <div className="text-2xl mb-5 uppercase border-b-2 border-[#33ff00] pb-2.5 w-full text-center tracking-[2px] animate-text-flicker">{choiceForm === 0 ? "AUTHENTICATION" : "NEW USER PROTOCOL"}</div>

            {Object.entries(formuse[choiceForm].data).map(([key, value]) => {
                if (key !== "name") return (
                    <div key={key} className="w-full flex flex-col gap-1.5 font-mono">
                        <div className="text-[0.9rem] opacity-80">{key.toUpperCase()} {'>'}</div>
                        <input
                            name={key}
                            defaultValue={value}
                            autoComplete="off"
                            placeholder={key === "password" ? "***" : "_"}
                            type={key.includes("password") ? "password" : "text"}
                            onChange={e => handleChange(key, e.target.value)}
                            onBlur={e => handleBlur(key, e.target.value)}
                            className={`bg-black border text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 outline-none shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full box-border focus:shadow-[inset_0_0_15px_rgba(51,255,0,0.3)] focus:bg-[#051a05] ${errors[key] && touched[key] ? 'border-[#ff3333]' : 'border-[#33ff00]'}`}
                        />
                        {errors[key] && touched[key] && <p className="text-[#ff3333] text-[0.8rem] mt-1">{errors[key]}</p>}
                    </div>
                )
            })}

            {choiceForm === 1 ? (
                <div className="w-full flex flex-row items-center gap-2.5 mt-2.5 font-mono">
                    <input
                        type="checkbox"
                        className="inline-block w-2.5 h-2.5 border-2 border-[#33ff00]"
                        name="newsletter"
                        checked={auth.signupForm.isTwoFactorEnabled}
                        onChange={() =>
                            auth.SetSignUpForm({ ...auth.signupForm, isTwoFactorEnabled: !auth.signupForm.isTwoFactorEnabled })
                        }
                        style={{ accentColor: '#33ff00' }}
                    />
                    <span className="font-mono text-[0.9rem]">{t("doubleAuthentificate.enable")}</span>
                </div>) : null}

            <div className="flex gap-5 w-full mt-2.5">
                <button
                    className="flex-1 font-mono font-bold text-[1.1rem] uppercase bg-black py-3 px-6 border cursor-pointer flex items-center justify-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 border-[#2a9d8f] text-[#2a9d8f] hover:bg-[#2a9d8f] hover:text-black"
                    onClick={() => auth.SetProfilPage(false)}
                >
                    {t("login.exit")}
                </button>
                <button
                    className={`flex-1 font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-3 px-6 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer flex items-center justify-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 ${hasErrors ? 'opacity-50' : ''}`}
                    onClick={handleSubmit}
                >
                    {t("login.valid")}
                </button>
            </div>
            <div className="mt-4 text-[0.8rem] opacity-70">
                <span
                    className="underline cursor-pointer text-white ml-1.5 hover:text-[#33ff00] hover:shadow-[0_0_5px_#33ff00]"
                    onClick={() => { setChoiceForm((choiceForm + 1) % 2) }}
                >
                    {formuse[choiceForm].txt}
                </span>
            </div>
        </Card>
    )
}


export default function AuthPage({ auth, choiceForm, setChoiceForm }
    : {
        auth: UseAuthReturn;
        choiceForm: number,
        setChoiceForm: (value: number) => void,
    }) {

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/80"></div>
            <div className="relative z-[101]">
                {!auth.DoubleAuthPage ? (
                    <AuthBody auth={auth} choiceForm={choiceForm} setChoiceForm={setChoiceForm}></AuthBody>
                ) : <DoubleAuthentificacte auth={auth}></DoubleAuthentificacte>}
            </div>
        </div>
    )
};