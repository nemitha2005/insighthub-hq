import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  passwordVisible?: boolean;
}

export function AuthenticationForm({
  email,
  onEmailChange,
  onPasswordChange,
  password,
  passwordVisible = true,
}: Props) {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
        <Label className={'text-muted-foreground leading-5 text-sm'} htmlFor="email">
          Email address
        </Label>
        <Input
          className={'border-border rounded-xs text-sm sm:text-base'}
          type="email"
          id="email"
          autoComplete={'username'}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      {passwordVisible && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className={'text-muted-foreground leading-5 text-sm'} htmlFor="password">
            Password
          </Label>
          <Input
            className={'border-border rounded-xs text-sm sm:text-base'}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
      )}
    </>
  );
}
