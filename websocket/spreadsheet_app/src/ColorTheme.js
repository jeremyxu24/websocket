import { useMantineColorScheme, Button, Group } from '@mantine/core';

export default function ColorThemeComponent() {
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();

  return (
    <Group>
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
    </Group>
  );
}