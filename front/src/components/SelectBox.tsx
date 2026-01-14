import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

interface LanguageOption {
  value: string;
  name: string;
}

export function DataSelect({ data, value, setVal, placeholder }: {
  data: LanguageOption[],
  value: string,
  setVal: (value: string) => void,
  placeholder: string
}) {
  return (
    <Select value={value ?? ""} onValueChange={(value: string) => setVal(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder ?? "value"} />
      </SelectTrigger>

      <SelectContent position="popper" className="z-[9999] bg-black/90 border-[#33ff00] backdrop-blur-sm">
        {data.map((lang: LanguageOption) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
