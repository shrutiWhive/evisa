import { useEffect } from "react";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useAppSelector } from "src/redux/hooks";
import { selectAuthState } from "src/redux/selectors";

// ----------------------------------------------------------------------

export function HomeView() {
  const router = useRouter();

  const { isLogin } = useAppSelector(selectAuthState);

  const checkPermission = () => {
    if (isLogin) {
      router.replace(paths.dashboard.root);

      return;
    }

    router.replace(paths.auth.signIn);
  };

  useEffect(() => {
    checkPermission();
  }, [isLogin]);

  return null;
}
