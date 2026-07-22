import java.awt.Robot;
import java.awt.event.*;
 mouse=Robot;
 key=Robot;
 
mouse.mouseMove(0, 0);
screenSize = get(0, 'screensize')
for i = 1:600% screenSize(4)
mouse.mouseMove(i, i);
pause(0.00001);
end
pause(2);
 mouse.mouseMove(0,800);
 mouse.mousePress(InputEvent.BUTTON1_MASK);
% mouse.delay(200);
 mouse.mouseRelease(InputEvent.BUTTON1_MASK);

mouse.keyPress(87);
mouse.keyPress(79);
pause(2);
mouse.keyPress(KeyEvent.VK_ENTER);
mouse.keyRelease(KeyEvent.VK_ENTER);
