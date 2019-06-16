export default `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.2" tiledversion="1.2.3" orientation="orthogonal" renderorder="right-down" width="512" height="128" tilewidth="16" tileheight="16" infinite="0" nextlayerid="5" nextobjectid="108">
 <properties>
  <property name="gravity" value="0.5"/>
  <property name="surfaceLevel" value="64"/>
 </properties>
 <tileset firstgid="1" name="tiles" tilewidth="16" tileheight="16" tilecount="1024" columns="32">
  <image source="../Workspace/posthumus/src/assets/images/tiles.png" width="512" height="512"/>
  <tile id="675">
   <animation>
    <frame tileid="106" duration="100"/>
    <frame tileid="105" duration="100"/>
    <frame tileid="107" duration="100"/>
    <frame tileid="104" duration="100"/>
   </animation>
  </tile>
 </tileset>
 <layer id="1" name="background" width="512" height="128" opacity="0.69">
  <properties>
   <property name="collide" type="bool" value="false"/>
  </properties>
  <data encoding="base64" compression="zlib">
   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
  </data>
 </layer>
 <layer id="2" name="main" width="512" height="128">
  <properties>
   <property name="collide" type="bool" value="true"/>
  </properties>
  <data encoding="base64" compression="zlib">
   eJzt3VuO2zYUBmDPoC9Bn1oUXUiWkNduI2nRfbU7aXaS7qM2AqOGoCt1JB6R3wcQmUF0ISl7fomi7NsNAAAAAAAAAAAAAAAAAAAAAPL56e12+/mtdi0AgLM8sv/99r04BwCA9r1mv3MAAGjfWPa3eg4w1c6tywDAVX2+ly+36bx7lt/v5Y9KdTzC1iyX/QD0psXsa7FNABCpxaycGu8HAL5rMRdbbBMArLVmjluLWbnUJvP/AOjBXLa1mHvm/wGA/I9eHgCuYGrcv9Vxb/kPAK7/l851svaB72oAYI/e8z96+TP4rgYA9jL/P3b5o/muBgAiZMu3o101/5c+r7m1z2kG4Fil+fbnRa85t85tzJL/Tz6fAIAIpdlx1cy56vX/k/wHIML74Oceytb+idhX1P16+Q9AhC3ZUTu3W8n/PecAz/X/upe/R/YDAGucnYcZylybots7t52Sc4Dnuv/cy9eZegPAnJLsqJ3f0fm/1NYjlG732YZv9/LvraxNALB0jdqzI/tgb/47TgDssZT/vWdLtvY7RgBEWJP/PedLtrY7PgBEWJv/vWZMtnY7NgBE2JL/rZS5vhguM7ZO7frLfwD2kv/r+6fWskvb+XjRz2IGoJ4e83/LuUD2a+vs9QMgp7H8+HHkO2ZbKnv7J5Ps9QMgp7H8KMnJI+qRYT/Z8zV7/QDIqbf8kP8A0F9+1L73sHXuQfT9DAB46C0/srQ3KruztAeAa6lxXXnUXL21+84gqo1Z2gNAG7Zk05YM2rrd6HzLkpfvEz/v2Q4A7PXIlU8j5cxn8Eq3eYX75cN6lNYrS3sAaEOruZKlXWP1KKlblvYA0IZWcyVy/KF0vbn1S/YFAFFazZWt7VrK6bPqcUQdAGCo1VyJyv/n/9W6b/8++BcAIrSaK1P33aeyfKkfSs8BosYOWj1OANTxOv9/bplM8/8j9/1ah7X1jN7umvXkPwCRsjwzF73vo3J6az+Z6w9ARlmfm99rbXtK2h0xbz9q3AIASrSaQWeN0y9ts5X+BKAtrV6H1s7/qP58Xf/DW0zdACByDl0m0fP/t+47uj+vfCwAyOeRK5+CyljGlay/tkx5bm9rP0TYU++l7QJAlJJciczKaK/nE2fXJeLc5cj6AcDne/lyaytXhuMJW0z1w9YxiegyrAcA8L+19yOGou7PH+0q9QSAs0zNJxiz5jo/o8i5BEBuv528v97+lhw9Xss5prK/ZPw/83H02oMc9rz/ovPm15Fngn84YD+Z8q9W287qj7P6+oj2Dl+Pv7xdo+9rvZbXqvmarP1+gBK1/u4oipKrjKldJ0VRjitAbkvv3bW/733/+3sBAOeR/wDQH/kPAESR/wDAw9zYgPwHgP7IfwDoj/wHgHPVfA7Y88IA0A7z/wCgP/IfAPoj/wGgP/IfAPrj+0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAW/QehtStA
  </data>
 </layer>
 <objectgroup id="3" name="objects">
  <properties>
   <property name="collide" type="bool" value="true"/>
  </properties>
  <object id="2" name="zombie" type="zombie" x="272" y="960" width="32" height="48"/>
  <object id="3" name="zombie" type="zombie" x="1280" y="944" width="32" height="48"/>
  <object id="4" name="zombie" type="zombie" x="880" y="944" width="32" height="48"/>
  <object id="5" name="zombie" type="zombie" x="656" y="944" width="32" height="48"/>
  <object id="6" name="Slope" type="slope_right" x="2136" y="976" width="32" height="16"/>
  <object id="8" name="Slope" type="slope_right" x="568" y="992" width="32" height="16"/>
  <object id="9" name="Slope" type="slope_right" x="1160" y="976" width="48" height="16"/>
  <object id="11" name="Slope" type="slope_right" x="1848" y="992" width="48" height="16"/>
  <object id="12" name="Slope" type="slope_right" x="2760" y="992" width="32" height="16"/>
  <object id="13" name="Slope" type="slope_right" x="3160" y="992" width="48" height="16"/>
  <object id="14" name="Slope" type="slope_left" x="2936" y="992" width="32" height="16"/>
  <object id="15" name="Slope" type="slope_left" x="2568" y="992" width="32" height="16"/>
  <object id="16" name="Slope" type="slope_left" x="2504" y="976" width="32" height="16"/>
  <object id="17" name="Slope" type="slope_left" x="1480" y="992" width="48" height="16"/>
  <object id="18" name="Slope" type="slope_left" x="1208" y="976" width="48" height="16"/>
  <object id="20" name="Bat" type="bat" x="1648" y="896" width="28" height="28"/>
  <object id="27" name="Dark" type="dark_mask" x="3232" y="608" width="848" height="384">
   <properties>
    <property name="light_color" value="rgba(150,150,200,0.3)"/>
   </properties>
  </object>
  <object id="29" name="Lava" type="lava" x="4096" y="1152" width="176" height="64"/>
  <object id="30" name="Bat" type="bat" x="2688" y="864" width="28" height="28"/>
  <object id="31" name="Slope" type="slope_left" x="3256" y="800" width="96" height="96"/>
  <object id="40" name="Slope" type="slope_left" x="3752" y="672" width="32" height="32"/>
  <object id="41" name="Slope" type="slope_right" x="3560" y="672" width="32" height="32"/>
  <object id="42" name="Dark" type="dark_mask" x="3136" y="432" width="64" height="240">
   <properties>
    <property name="light_color" value="rgba(200,100,200,0.3)"/>
   </properties>
  </object>
  <object id="47" name="Slope" type="slope_left" x="3240" y="480" width="64" height="64"/>
  <object id="55" name="Slope" type="slope_left" x="3224" y="672" width="32" height="32"/>
  <object id="56" name="Dark" type="dark_mask" x="4096" y="192" width="176" height="448">
   <properties>
    <property name="light_color" value="rgba(160,160,160,0.3)"/>
   </properties>
  </object>
  <object id="57" name="Dark" type="dark_mask" x="3136" y="208" width="96" height="192">
   <properties>
    <property name="light_color" value="rgba(200,100,200,0.3)"/>
   </properties>
  </object>
  <object id="58" name="Dark" type="dark_mask" x="3232" y="432" width="832" height="128">
   <properties>
    <property name="light_color" value="rgba(200,100,200,0.3)"/>
   </properties>
  </object>
  <object id="59" name="Dark" type="dark_mask" x="4288" y="464" width="336" height="80">
   <properties>
    <property name="light_color" value="rgba(200,100,200,0.3)"/>
   </properties>
  </object>
  <object id="62" name="Dark" type="dark_mask" x="4288" y="560" width="624" height="464">
   <properties>
    <property name="light_color" value="rgba(200,200,200,0.3)"/>
   </properties>
  </object>
  <object id="64" name="Dark" type="dark_mask" x="4096" y="656" width="176" height="368">
   <properties>
    <property name="light_color" value="rgba(160,160,160,0.3)"/>
   </properties>
  </object>
  <object id="69" name="Spikes" type="spikes" x="928" y="992" width="64" height="16"/>
  <object id="70" name="Spikes" type="spikes" x="4096" y="624" width="176" height="16"/>
  <object id="72" name="Spikes" type="spikes" x="3552" y="992" width="48" height="16"/>
  <object id="73" name="Slope" type="slope_right" x="3976" y="896" width="96" height="96"/>
  <object id="74" name="Slope" type="slope_right" x="4536" y="832" width="96" height="96"/>
  <object id="75" name="Slope" type="slope_right" x="4824" y="736" width="96" height="96"/>
  <object id="76" name="Slope" type="slope_left" x="4280" y="928" width="80" height="80"/>
  <object id="77" name="Slope" type="slope_left" x="4376" y="736" width="96" height="96"/>
  <object id="78" name="Slope" type="slope_left" x="4632" y="832" width="96" height="96"/>
  <object id="79" name="Slope" type="slope_left" x="4632" y="640" width="96" height="96"/>
  <object id="80" name="Slope" type="slope_left" x="4920" y="912" width="176" height="80"/>
  <object id="81" name="spider" type="spider" x="4481" y="616" width="24" height="24"/>
  <object id="82" name="spider" type="spider" x="4896" y="840" width="24" height="24"/>
  <object id="83" name="spider" type="spider" x="4576" y="984" width="24" height="24"/>
  <object id="84" name="spider" type="spider" x="4784" y="616" width="24" height="24"/>
  <object id="85" name="Crusher" type="crusher" x="3824" y="1024" width="32" height="48">
   <properties>
    <property name="delay" value="2000"/>
   </properties>
  </object>
  <object id="86" name="Crusher" type="crusher" x="3888" y="1024" width="32" height="48">
   <properties>
    <property name="delay" value="1000"/>
   </properties>
  </object>
  <object id="87" name="Crusher" type="crusher" x="3952" y="1024" width="32" height="48">
   <properties>
    <property name="delay" value="1100"/>
   </properties>
  </object>
  <object id="95" name="zombie" type="zombie" x="3360" y="944" width="32" height="48"/>
  <object id="96" name="zombie" type="zombie" x="3504" y="848" width="32" height="48"/>
  <object id="98" name="spider" type="spider" x="3424" y="680" width="24" height="24"/>
  <object id="99" name="spider" type="spider" x="3920" y="520" width="24" height="24"/>
  <object id="100" name="Player" type="player" x="48" y="960" width="32" height="48"/>
  <object id="101" name="Spider trap" type="spider_trap" x="1056" y="896" width="16" height="23">
   <properties>
    <property name="delay" value="800"/>
   </properties>
  </object>
  <object id="102" name="Spider trap" type="spider_trap" x="2416" y="880" width="16" height="23">
   <properties>
    <property name="delay" value="800"/>
   </properties>
  </object>
  <object id="103" name="Spider trap" type="spider_trap" x="3200" y="320" width="16" height="23">
   <properties>
    <property name="delay" value="800"/>
   </properties>
  </object>
  <object id="104" name="Spider trap" type="spider_trap" x="3888" y="608" width="16" height="23">
   <properties>
    <property name="delay" value="800"/>
   </properties>
  </object>
  <object id="105" type="slope" x="304" y="1008">
   <polygon points="0,0 48,-16 144,-16 176,0"/>
  </object>
  <object id="107" name="zombie" type="zombie" x="1040" y="944" width="32" height="48"/>
 </objectgroup>
 <layer id="4" name="foreground" width="512" height="128">
  <properties>
   <property name="collide" type="bool" value="false"/>
  </properties>
  <data encoding="base64" compression="zlib">
   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
  </data>
 </layer>
</map>`
