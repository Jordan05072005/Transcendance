import { useTranslation } from 'react-i18next';

type FriendRequestCardProps = {
  username: string;
  onAccept: () => void;
  onReject: () => void;
};

export const FriendRequestCard = ({ username, onAccept, onReject }: FriendRequestCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5 flex items-center justify-between">
      <span className="font-bold text-[#33ff00]">{username}</span>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="font-mono font-bold text-[0.8rem] uppercase py-1 px-2 border cursor-pointer transition-all hover:opacity-80 border-[#33ff00] text-[#33ff00] hover:bg-[#33ff00] hover:text-black"
        >
          {t("friend.accept")}
        </button>
        <button
          onClick={onReject}
          className="font-mono font-bold text-[0.8rem] uppercase py-1 px-2 border cursor-pointer transition-all hover:opacity-80 border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-black"
        >
          {t("friend.reject")}
        </button>
      </div>
    </div>
  );
};
