import type { ConceptCategory, Concept, Pose } from '../components/concept-photo/types';

// Raw data structure from user
interface PromptSet {
  id: string;
  name: string;
  category: string;
  prompts: string[];
  numPortraits?: number;
  isFamilyPrompt?: boolean;
  simpleFamilyMode?: boolean;
}

const promptSets: PromptSet[] = [
// Ảnh trung thu
{
id: 'mid-autumn-festival',
name: 'Ảnh trung thu',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"Ultra realistic portrait of a young Vietnamese woman in traditional red and white floral áo yếm with a long flowing red skirt. She sits gracefully on ancient stone steps, holding a carp-shaped lantern on a stick. She looks softly at the camera with a warm smile, sunset rays glowing through tree leaves in the foreground. Cinematic golden light, 8K UHD, pastel tones, nostalgic and romantic atmosphere.",
"Ultra realistic portrait of a young Vietnamese woman in red floral áo yếm and long red skirt, standing elegantly by an old wooden balcony. She holds a carp lantern on a stick with both hands, gazing sideways with a dreamy expression. Golden sunset shines from behind, forming radiant beams around her hair. Background: blurred greenery, cinematic warm tones, ultra detailed, 8K UHD.",
"Ultra realistic portrait of a young Vietnamese woman wearing a red floral áo yếm and flowing skirt, walking slowly in a temple courtyard at sunset. She holds a carp-shaped lantern gently in one hand, the other hand lifting her skirt slightly while walking. Soft breeze moves her hair, sunset golden rays fill the background. Cinematic soft lighting, sharp focus, romantic atmosphere, 8K UHD.",
"Ultra realistic portrait of a young Vietnamese woman dressed in red and white floral áo yếm with a flowing skirt, sitting gracefully on a rustic wooden chair. She holds the carp lantern close to her chest, tilting her head slightly with a serene smile. Warm sunset light bathes her face, cinematic golden tones, soft romantic atmosphere, ultra sharp 8K UHD.",
"Ultra realistic portrait of a young Vietnamese woman in traditional áo yếm, long red skirt, holding up a carp lantern high with both hands as if admiring it. Her braided hair glows under the golden rays of the setting sun. Background: ancient temple gate in soft blur, cinematic pastel golden light, 8K UHD, sharp focus, pure and nostalgic feeling."
]
},
// Nàng thơ & Hoa Loa Kèn
{
id: 'lily-muse',
name: 'Nàng thơ & Hoa Loa Kèn',
category: 'Nàng Thơ & Studio',
prompts: [
"A 30-year-old Vietnamese woman with a delicate face, smooth white skin, light makeup with rosy cheeks, and natural pink lips. Her long black hair is tied low, with a few strands of hair falling loosely, and a large white lily pinned to her ear. Keeping the same facial expression from the uploaded photo. She wears a modern white off-the-shoulder dress She places one hand close to her face, looking gentle and feminine. In front of her is a branch of blooming white lilies with detailed petals and fresh green leaves. Background: light beige studio backdrop, soft lighting, creating a pure and romantic atmosphere. Style: Ultra realistic, 8K UHD, sharp focus, pastel tones, cinematic soft light.",
"Close-up portrait focusing on her serene expression, with a single white lily gently brushing against her cheek. Her eyes are closed softly. The lighting is ethereal, creating a soft glow on her skin and the flower petals. The background is a simple, out-of-focus light beige. Ultra realistic, cinematic, 8K UHD.",
"She is sitting gracefully, holding a bouquet of white lilies on her lap. She looks down at the flowers with a tender, shy smile. The modern white off-the-shoulder dress drapes elegantly. The studio light mimics a soft morning sunbeam from the side. Romantic and pure atmosphere, 8K UHD.",
"A full-body shot where she stands elegantly, turning slightly to the side, with a backdrop of cascading white lilies. One hand gently touches a lily petal. The lighting creates dramatic yet soft shadows, emphasizing the contours of her dress and figure. Style: high-fashion editorial, ultra realistic, 8K UHD.",
"She is captured in a moment of playful innocence, lightly smelling a white lily held in her hand, with a genuine, happy smile. The focus is sharp on her face and the flower, with the background softly blurred. The lighting is bright and airy. Joyful and romantic mood, 8K UHD, cinematic."
]
},
{
id: 'painter-muse',
name: 'Nàng Thơ hoạ sĩ',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, high-definition studio portrait. A beautiful young painter muse is sitting on the floor amidst an abundance of pink flowers like lilies and peonies. She wears a delicate outfit, a crochet hat, and blue gloves, winking playfully at the camera while resting her chin on her hand. An easel stands in the background. The lighting is soft and cinematic, creating a dreamy and artistic atmosphere. 8K UHD, sharp focus, flawless skin.",
"Ultra realistic studio portrait. The painter muse stands in front of her easel, holding a palette and a brush as if about to start a masterpiece. She looks over her shoulder at the camera with a gentle, creative smile. She is surrounded by vases of pink flowers. The lighting is bright and inspiring. 8K UHD, artistic concept.",
"Ultra realistic, close-up beauty shot. The painter muse, wearing her crochet hat, holds a large pink peony close to her face, looking at the camera with soft, dreamy eyes. The background is a soft blur of her art studio and flowers. The lighting is ethereal, highlighting her flawless skin and the delicate flower petals. 8K UHD, romantic.",
"Ultra realistic portrait. The painter muse is kneeling on the floor, carefully arranging flowers on her blank canvas, creating a piece of living art. Her expression is focused and serene. The studio is filled with soft, natural light, creating a calm and creative mood. 8K UHD, candid moment.",
"Ultra realistic studio portrait. The painter muse sits on a rustic wooden stool, looking thoughtfully at the blank canvas on the easel. A single paintbrush is held loosely in her hand. The floor is scattered with pink flower petals. The atmosphere is contemplative and full of potential. 8K UHD, cinematic lighting."
]
},
{
id: 'muse-flower-basket',
name: 'Nàng thơ + Giỏ hoa',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, high-definition studio portrait. A beautiful young woman is crouching gracefully. She has long, wavy dark hair with a floral bandana and small flowers tucked behind her ear. She wears a charming patchwork floral dress, lace arm warmers, and white boots. She holds a white woven basket filled with a vibrant mix of colorful flowers. A small yellow watering can sits beside her. She looks at the camera with a gentle, sweet expression. The background is a clean, bright white studio. Lighting is soft and bright, creating a fresh and pure atmosphere. 8K UHD, cinematic, sharp focus.",
"Ultra realistic studio portrait. The young woman is kneeling on the floor, looking down with a tender smile at the colorful flowers in the white basket she's holding. Her long, wavy hair falls gently over her shoulder. The floral patchwork dress, lace arm warmers, and white boots are visible. The bright white studio background is clean and minimalist. The lighting mimics soft, natural morning light, creating a serene and gentle mood. 8K UHD, detailed.",
"Ultra realistic, close-up beauty shot. The young woman looks directly at the camera with a soft, inviting gaze. Her face is framed by her wavy hair, floral bandana, and the flowers she's holding up in the basket. The focus is on her flawless skin and gentle makeup. The background is a soft, out-of-focus white. Ethereal and romantic atmosphere, 8K UHD, cinematic lighting.",
"Ultra realistic, full-body studio portrait. The young woman stands elegantly, holding the basket of flowers with one hand. She looks over her shoulder at the camera with a bright, friendly smile. The patchwork floral dress flows around her. The yellow watering can is on the floor. The background is a minimalist, bright white studio. Cheerful and fresh mood, 8K UHD, sharp focus.",
"Ultra realistic studio portrait. The young woman is sitting on the floor, pretending to water the flowers in her basket with the small yellow watering can. She has a playful, laughing expression. Her floral bandana and patchwork dress create a whimsical vibe. The bright white studio background keeps the focus on her joyful action. Playful and charming atmosphere, 8K UHD, cinematic."
]
},
{
id: 'studio-white-lily',
name: 'Studio với hoa loa kèn trắng',
category: 'Nàng Thơ & Studio',
prompts: [
"Elegant studio beauty portrait of a young woman with dark hair in a bun, white lily flower in her hair, wearing an off-shoulder cream dress, soft natural makeup, flawless porcelain skin, romantic lighting, photorealistic, ultra-detailed, 8K UHD, cinematic.",
"Close-up studio beauty portrait. The young woman looks gently at the camera, her face partially framed by a large white lily. The focus is on her serene expression and the delicate texture of the flower petals. Soft, diffused lighting creates an ethereal glow. Romantic and pure atmosphere, 8K UHD.",
"Profile view studio portrait. The woman is looking away from the camera, her elegant neckline and the bun in her hair are highlighted. A single beam of soft light illuminates her profile. The background is a simple, muted tone to keep the focus on her. Artistic, minimalist, 8K UHD.",
"She is holding a single stem of a white lily, looking down at it with a soft, contemplative smile. The off-shoulder cream dress drapes gracefully. The lighting is soft and warm, creating a tender and intimate mood. Storytelling portrait, 8K UHD.",
"A portrait capturing a moment of quiet joy. She is gently touching the lily in her hair, with a slight, genuine smile. The camera is at eye level, creating a connection with the viewer. The lighting is bright and airy, conveying a sense of freshness and elegance. 8K UHD, cinematic."
]
},
// Váy trễ vai trắng & hoa
{
id: 'white-off-shoulder-dress',
name: 'Váy trễ vai trắng & hoa',
category: 'Nàng Thơ & Studio',
prompts: [
"Elegant studio portrait of a young woman in an off-shoulder white dress with puff sleeves, flawless porcelain skin, soft natural makeup, black hair in a neat bun, surrounded by white flowers and green leaves, sitting gracefully, romantic atmosphere, photorealistic, ultra-detailed, 8K UHD, cinematic.",
"Close-up studio beauty portrait of the young woman. She looks softly at the camera, her face framed by white flowers and delicate green leaves. Her black hair is in a neat bun. The focus is on her flawless skin and serene expression. Soft, diffused lighting creates an ethereal glow. Romantic and pure atmosphere, 8K UHD.",
"Full-body studio portrait of the young woman standing elegantly amidst a setting of white flowers and green plants. She is looking over her shoulder at the camera with a gentle smile. The off-shoulder white dress with puff sleeves flows gracefully. The lighting is soft and flattering, creating a dreamy and enchanting mood. 8K UHD.",
"Profile view studio portrait of the young woman. She is looking away, her elegant neckline and the neat bun highlighted. A single soft light illuminates her profile. The background is a soft arrangement of blurred white flowers and leaves, keeping the focus on her. Artistic, minimalist, 8K UHD.",
"Studio portrait of the woman sitting, holding a single white flower in her hands and looking down at it with a soft, contemplative expression. The puff sleeves of her white off-shoulder dress are a key feature. The lighting is warm and gentle, creating a tender and intimate mood. Storytelling portrait, 8K UHD."
]
},
// Áo Dài & Lồng Đèn Lễ Hội
{
id: 'ao-dai-lantern-festival',
name: 'Áo Dài & Lồng Đèn Lễ Hội',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"A festive outdoor portrait of a young Vietnamese woman at a Mid-Autumn Festival market. She has a slim and graceful figure, with fair, luminous white skin that enhances her elegance. She wears a long flowing white áo dài with delicate floral embroidery. In her hands, she holds a traditional folding fan, positioned elegantly at her waist. Her straight dark hair is styled simply, flowing down over one shoulder, highlighting her refined look. The background is filled with colorful Mid-Autumn lanterns, including red and gold fish-shaped lanterns, star lanterns, and other festive decorations, creating a lively and joyful atmosphere. The lighting is warm golden hour sunlight, casting a soft glow on her fair skin and outfit, while enriching the vibrant colors of the lanterns. Use the exact face from the uploaded image, preserving all natural features and expression accurately. Style: Cultural portrait photography, festive, realistic. Mood: Joyful, elegant, traditional.",
"She is sitting on a small wooden stool amidst the lantern stalls, looking up at a large star-shaped lantern with a curious and joyful expression. Her white áo dài spreads neatly around her. The folding fan is gently placed on her lap. The scene is illuminated by the warm, ambient light from hundreds of lanterns, creating a magical bokeh effect in the background. Ultra realistic, 8K UHD.",
"A candid shot of her walking through the bustling festival market, a gentle smile on her face as she glances at the camera. She holds the fan half-open in one hand. The motion blurs the background slightly, conveying a sense of movement and liveliness. The warm lantern light catches the floral embroidery on her áo dài. Cinematic, joyful, 8K UHD.",
"Close-up portrait where she holds the folding fan open, partially covering the lower half of her face, her eyes smiling warmly at the camera. The intricate details of the fan and the delicate embroidery on her áo dài are in sharp focus. The background is a soft blur of vibrant lantern colors. Elegant, mysterious, 8K UHD.",
"She is seen from the side, releasing a small floating lantern into the air. Her profile is illuminated by the lantern's glow, creating a serene and hopeful moment. The background shows other people and lanterns, but the focus is on her graceful pose and the floating light. Atmospheric, poignant, 8K UHD."
]
},
// Nàng Thơ & Bánh Kem Sinh Nhật
{
id: 'birthday-muse-cake',
name: 'Nàng Thơ & Bánh Kem Sinh Nhật',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, high definition, fairy tale style studio portrait. A young Vietnamese girl around 20-35 years old, delicate face, clear white-pink skin, big sparkling eyes, soft pink lips. Keep the same facial expression from the uploaded photo. She has long, silky black hair, loosely tied with a white bow at the back of her head. She wears a fluffy cream-yellow princess dress, soft silk material, naturally fluttering. In front of her is a white birthday cake decorated with light pink pastel roses. She places her two hands gently under her chin, her eyes sparkling, gentle and pure. The minimalist studio background is light beige, the soft light creates a romantic feeling, like a scene in a fairy tale. Ultra realistic, 8k UHD, cinematic lighting, dreamy and elegant atmosphere.",
"She is making a wish with her eyes closed, hands clasped together near the glowing candles on the birthday cake. A soft smile plays on her lips. The only light source is the warm candlelight, casting a gentle glow on her face and creating soft shadows. Intimate, magical atmosphere, 8K UHD.",
"A joyful, candid shot of her clapping her hands in delight after blowing out the candles. A few wisps of smoke rise from the wicks. Her expression is one of pure happiness. The lighting is bright and cheerful. Dreamy and celebratory mood, 8K UHD.",
"She is sitting beside the table with the cake, looking directly at the camera with a serene and graceful expression. One hand rests gently on the table near the cake. The fluffy princess dress fills the lower frame. The lighting is soft and even, like a classic portrait. Elegant, pure, 8K UHD.",
"A close-up shot focusing on her hands as she delicately cuts the first slice of the birthday cake. The cake is beautifully detailed with pastel roses. Her face is slightly in the background, out of focus but with a gentle smile visible. The focus is on the act of celebration. Storytelling, detailed, 8K UHD."
]
},
// Váy Vàng Studio
{
id: 'pastel-yellow-dress-studio',
name: 'váy vàng studio',
category: 'Nàng Thơ & Studio',
prompts: [
"Cinematic studio portrait of a beautiful young woman in a pastel yellow dress, surrounded by decorative white and purple flowers and lush green plants, long wavy dark hair, flawless glowing skin, dreamy expression, professional soft lighting, photorealistic, ultra-detailed, 8K UHD.",
"Close-up cinematic studio portrait of a beautiful young woman in a pastel yellow dress. She gently touches a white flower near her face, her long wavy dark hair cascading over one shoulder. Her expression is soft and dreamy, eyes looking slightly away from the camera. The background is a soft-focus arrangement of white and purple flowers and green plants. Professional soft lighting illuminates her flawless glowing skin. Photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a beautiful young woman sitting gracefully on a velvet stool. She wears a pastel yellow dress, surrounded by an artful arrangement of white and purple flowers and lush green plants. Her hands are resting on her lap, holding a single purple flower. Her long wavy dark hair is elegantly styled. The lighting is soft and romantic, creating a dreamy and serene atmosphere. Photorealistic, ultra-detailed, 8K UHD.",
"Profile view cinematic studio portrait of a beautiful young woman in a pastel yellow dress. She is looking to the side, her silhouette framed by lush green plants and soft white and purple flowers. A gentle light highlights the contours of her face and her long wavy dark hair. Her expression is calm and contemplative. The atmosphere is ethereal and artistic. Photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a beautiful young woman in a pastel yellow dress, looking over her shoulder at the camera with a gentle, inviting smile. Her long wavy dark hair flows down her back. The foreground is blurred with lush green leaves and soft purple flowers, creating a sense of depth. The background is a soft, floral setting. Professional soft lighting creates a warm, enchanting glow. Photorealistic, ultra-detailed, 8K UHD."
]
},
// Sinh nhật Tone Hồng
{
id: 'pink-tone-birthday',
name: 'Sinh nhật Tone Hồng',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, high-definition studio portrait. A beautiful young woman celebrates her birthday. She wears an elegant white strapless dress and a large white bow in her dark, styled hair, with a delicate white choker. She sits at a table decorated in a pastel pink theme, with a delicate white birthday cake topped with a crown, glasses of champagne tied with pink ribbons, and glowing candles. She poses gracefully with hands clasped under her chin, looking at the camera with a sweet, gentle smile. The background is a soft, muted gray. Lighting is soft and cinematic, creating a dreamy and romantic atmosphere. 8K UHD, sharp focus, flawless skin.",
"Close-up beauty shot. The woman leans her head on her hands, showing off her flawless makeup with rosy pink blush. A strand of hair falls gently across her face. The background is a soft blur of the pink-themed party table. The lighting is ethereal, highlighting her sparkling eyes and soft lips. Elegant and pure atmosphere, 8K UHD.",
"She playfully holds a champagne glass, looking at the camera with a charming wink. The pink ribbons on the glass add a festive touch. The focus is on her joyful expression and the elegant details of the scene. The lighting is bright and celebratory. 8K UHD, cinematic.",
"A serene moment as she closes her eyes to make a birthday wish in front of the beautifully decorated cake. Her hands are clasped near her heart. The candlelight casts a warm, gentle glow on her face, creating an intimate and magical mood. 8K UHD.",
"She looks back over her shoulder with a captivating smile. The large white bow in her hair is a prominent feature. The background is softly blurred, keeping the focus on her elegant posture and the delicate details of her white dress. High-fashion, romantic, 8K UHD."
]
},
// Sinh nhật Studio + Bóng bay đỏ
{
id: 'red-balloon-birthday-studio',
name: 'Sinh nhật Studio + Bóng bay đỏ',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, high-definition studio portrait. A beautiful young woman sits at a table with a red tablecloth. She wears an elegant white dress and has a red cherry clip in her wavy dark hair. In front of her is a white birthday cake decorated with fresh strawberries. The background is a clean, bright white studio. She looks at the camera with a sweet, gentle smile. Lighting is soft and celebratory. 8K UHD, cinematic, festive and elegant atmosphere.",
"Ultra realistic, full-body studio portrait. A joyful young woman in a white ballet-style outfit with a fluffy tutu and red ribbon details, holding a large bunch of red heart-shaped balloons. She is smiling happily, kicking one leg up playfully. The background is a minimalist light gray studio. The lighting is bright and airy, capturing a moment of pure celebration. 8K UHD, sharp focus, dynamic and sweet.",
"Ultra realistic, close-up beauty shot. A young woman with flawless makeup and a red lip, her dark hair styled with red ribbons. She holds a small cupcake with a single strawberry on top, her eyes closed with a happy smile. The background is a soft, out-of-focus white. Lighting is soft and flattering, highlighting her joyful expression. 8K UHD, elegant and pure atmosphere.",
"Ultra realistic studio portrait. A young woman in an intricate white lace corset dress, wearing sheer white gloves. She sits at a red table with tall red candles and a multi-tiered white cake with red ribbons. She raises a glass with a cherry in it, smiling charmingly at the camera. The background is a clean white studio. Atmosphere is sophisticated and festive. 8K UHD, cinematic.",
"Ultra realistic studio portrait. A young woman in a soft white sweater and tutu skirt, kneeling on the floor surrounded by red heart-shaped balloons. She looks over her shoulder at the camera with a bright, winking expression. A birthday cake sits beside her. The setting is a clean white studio, creating a fresh and modern celebratory feel. 8K UHD, playful and chic."
]
},
// Nàng thơ ngoại cảnh
{
id: 'outdoor-muse',
name: 'Nàng thơ ngoại cảnh',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic portrait of a beautiful young woman sitting gracefully on lush green grass in a sunlit park. She holds a transparent umbrella adorned with colorful butterflies. Her long black hair flows freely. She wears a simple, elegant cream-colored slip dress. She looks up with a gentle, dreamy expression, her chin resting on her hand. Golden sunlight filters through the trees, creating a soft, ethereal glow. The atmosphere is romantic and fairy-tale-like. 8K UHD, cinematic lighting, sharp focus.",
"Ultra realistic portrait of a beautiful young woman sitting on green grass, holding a transparent umbrella decorated with butterflies. She looks directly at the camera with a gentle, serene expression, one hand lightly touching her chin. She wears a simple cream-colored dress, and a butterfly is perched in her long dark hair. The background is a soft-focus green park with warm sunlight. The mood is pure and enchanting. 8K UHD, cinematic, soft focus background.",
"Ultra realistic portrait of a beautiful young woman sitting on the grass under a transparent umbrella decorated with butterflies. She wears a delicate off-shoulder ruffled dress in a light color. She holds the umbrella with one hand and rests her cheek on the other, looking at the camera with a soft, contemplative gaze. Butterflies are seen flying in the background. The lighting is warm and golden, creating a dreamy and magical atmosphere. 8K UHD, sharp focus, romantic.",
"Ultra realistic portrait of a young woman standing in a sun-drenched meadow, holding a transparent umbrella with butterflies on it. She is looking over her shoulder at the camera with a soft smile. Her long dark hair is gently blown by the wind. She wears a light, flowing dress. The scene is filled with a golden haze, creating a magical and romantic mood. 8K UHD, cinematic.",
"Close-up ultra realistic beauty portrait of a young woman under a transparent umbrella. The focus is on her delicate features and the colorful butterflies resting on the umbrella and in her hair. She has a serene expression, looking slightly away from the camera. The background is a blur of green and golden light. The lighting is soft and ethereal, highlighting her flawless skin. 8K UHD."
]
},
// Nữ Thần Múa Lân & Trăng Rằm
{
id: 'lion-dance-goddess',
name: 'Nữ Thần Múa Lân & Trăng Rằm',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"A beautiful young Asian woman with fair skin and a slim, slender physique, exuding elegance and grace. She has long, wavy, dark brown hair parted in the middle, with some strands neatly tied back with a red ribbon into a half-updo, while the rest flows down her shoulders and back. Her figure is slim yet shapely. She wears a stunning two-part red dress. The top is a strapless corset-style bodice with a sweetheart neckline. The skirt is made of multiple layers of ruffled red tulle. She stands with her right hand resting on a large red lion dance head, while her left hand is raised slightly to the side. Behind her is a large, glowing white full moon against a dark backdrop. Red branches with small blossoms are scattered in the scene. High-quality 4K, ultra-realistic full-body shot, sharp focus.",
"She is sitting on the ground, leaning against the large red lion dance head, looking up towards the full moon with a contemplative, powerful expression. The multi-layered red tulle skirt spreads around her on the misty ground. The lighting comes from the moon, creating a dramatic silhouette with rim lighting. Moody, epic, 8K UHD.",
"A dynamic action pose where she holds the lion dance head up with both hands as if performing a dance. Her hair and the red ribbons on her dress are flowing as if caught in a gust of wind. The focus is on her powerful and graceful movement. The full moon provides a stark backlight. Energetic, mythical, 8K UHD.",
"A close-up portrait from the chest up. She is looking directly at the camera with a confident, fierce gaze. One hand is gently touching the fur of the lion dance head beside her. The lighting is dramatic, highlighting the high cheekbones and defined jawline, with deep shadows. Powerful, high-fashion, 8K UHD.",
"She is standing with her back partially to the camera, looking over her shoulder. The long train of the red tulle skirt flows behind her. The red lion dance head is on the ground beside her. The glowing full moon and red blossom branches create a mystical and enchanting backdrop. Elegant, dramatic, 8K UHD."
]
},
// Fashion & Denim CK
{
id: 'fashion-denim-ck',
name: 'Fashion & Denim CK',
category: 'Fashion & Phong Cách',
prompts: [
"Ultra realistic fashion portrait of a young Vietnamese woman with a delicate face, fair smooth skin, subtle rosy makeup, and long straight black hair. She wears a black Calvin Klein lingerie set with visible logo waistband, layered with an oversized dark denim jacket falling off one shoulder and loose denim pants. She stands confidently, gazing directly at the camera with a bold expression. Studio backdrop in light gray, minimalistic background, sharp focus, cinematic soft light, 8K UHD, modern editorial style.",
"She is sitting on a simple wooden stool, leaning forward with her elbows on her knees. The oversized denim jacket is open, revealing the CK lingerie. She looks down, away from the camera, with a contemplative and cool expression. The lighting creates strong, defined shadows, emphasizing the texture of the denim. Moody, high-fashion, 8K UHD.",
"A full-body shot of her standing confidently with one arm raised behind her head, showcasing the athletic fit of the lingerie and the loose fit of the jeans. She looks at the camera with a slight, confident smirk. The lighting is clean and bright, typical of a modern fashion campaign. Bold, confident, 8K UHD.",
"A playful shot where she is holding a red lollipop, looking at the camera with a teasing and fun expression. She wears a red patterned bandana or headscarf. The oversized jacket is shrugged off her shoulders. The pop of red from the lollipop and headscarf contrasts with the denim and black. Youthful, edgy, 8K UHD.",
"A close-up from the waist up, focusing on the details. One hand is hooking a thumb into the waistband of the loose denim pants, with the CK logo clearly visible. Her expression is neutral but powerful. The focus is sharp on the textures of the lingerie, her skin, and the denim. Detailed, modern, 8K UHD."
]
},
{
id: 'black-blazer-chic',
name: 'vest đen cá tính',
category: 'Fashion & Phong Cách',
prompts: [
"Ultra realistic, high-definition fashion studio portrait. A beautiful young woman sits elegantly on a simple modern chair. She wears an oversized black blazer, a large white organza bow choker, polka dot tights, white socks, and chunky black and white heels. Her long black hair is styled in a chic half-updo. She gazes at the camera with a confident, cool expression. The background is a clean, minimalist light gray studio. 8K UHD, cinematic lighting, high-fashion editorial style.",
"Ultra realistic, close-up beauty shot. The young woman is sitting, leaning forward with her chin resting on her hand. Her large white organza bow choker is a prominent feature. The focus is on her striking makeup, with rosy cheeks and glossy lips, and her intense gaze. She wears an oversized black blazer. The background is a soft, out-of-focus light gray. Ethereal and chic atmosphere, 8K UHD, cinematic.",
"Ultra realistic, full-body fashion studio portrait. The young woman is sitting gracefully on the floor, her legs tucked to one side. She wears an oversized black blazer, a white tube top, a large white organza bow, polka dot tights, and chunky black and white heels. A small white handbag with black ribbons sits beside her. She looks directly at the camera with a poised and elegant expression. The background is a clean, bright white studio. 8K UHD, sharp focus, modern and sophisticated.",
"Ultra realistic fashion studio portrait. The young woman sits on a black cylindrical stool, one leg elegantly crossed over the other. She wears a chic oversized black blazer, a white bow choker, polka dot tights, and chunky black-and-white heels. She looks at the camera with a cool, detached expression. The background is a minimalist light gray studio. High-fashion, modern, 8K UHD, sharp focus.",
"Ultra realistic headshot portrait. A beautiful young woman with long black hair and windswept wisps. Her face is framed by a large, soft white organza bow tied around her neck. She looks directly into the camera with a captivating, soft expression. The black blazer is visible on her shoulders. The background is a simple, clean light gray. Focus is on her flawless skin, delicate makeup, and expressive eyes. 8K UHD, cinematic, pure and elegant."
]
},
// Sinh nhật vest đen + Gấu
{
id: 'black-vest-teddy-bear',
name: 'Sinh nhật vest đen + Gấu',
category: 'Fashion & Phong Cách',
prompts: [
"Ultra realistic, high-definition fashion studio portrait. A beautiful young woman with long wavy brown hair and stylish glasses. She wears a chic oversized black blazer as a dress, paired with black combat boots. She is sitting on a black leather sofa with her legs elegantly crossed, hugging a teddy bear to her chest. She rests her chin on her hand, gazing thoughtfully at the camera. The background is a clean white studio, surrounded by numerous cute brown teddy bears. The atmosphere is a mix of sophisticated and cute. 8K UHD, cinematic lighting.",
"Ultra realistic fashion studio portrait. A young woman with long brown hair and stylish glasses, wearing a black blazer dress and combat boots. She sits confidently on the edge of a black leather sofa, her legs stretched forward. She holds a large teddy bear in her lap with one hand, while the other adjusts her glasses with a chic gesture. The background is a clean white studio with other teddy bears scattered around. The look is powerful and intellectual. 8K UHD, sharp focus.",
"Ultra realistic fashion studio portrait. A playful shot of a young woman in a black blazer dress and glasses, nestled amongst a pile of teddy bears on a black leather sofa. She is hugging several of them at once and looks at the camera with a sweet, happy smile. The contrast between the serious outfit and the cute bears creates a charming atmosphere. Clean white studio background. 8K UHD.",
"Ultra realistic, full-body fashion studio portrait. A young woman in a black blazer dress and combat boots stands next to a black leather sofa. She holds a teddy bear under one arm like a clutch bag, looking over her shoulder at the camera with a confident expression. The background is a clean white studio. High-fashion editorial style. 8K UHD.",
"Ultra realistic, close-up beauty shot. A young woman with stylish glasses peeks playfully over the top of a large teddy bear she holds up to her face. Only her eyes and the top of her head are visible. The background is a soft-focus white studio setting. The expression is playful and mysterious. 8K UHD."
]
},
// Áo yếm đỏ - cá chép & đèn lồng
{
id: 'red-ao-yem-koi-lantern',
name: 'Áo yếm đỏ - cá chép & đèn lồng',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"Ultra realistic studio portrait of a young Vietnamese woman wearing a modernized traditional red and white floral áo yếm with a layered flowing red silk skirt. Her long black hair is styled in soft waves with a red flower accessory. She smiles gently while holding a cute, glowing carp-shaped lantern. Background: artistic studio decorated with floating red lanterns, sheer red fabric, and large paper koi fish suspended in the air. Lighting: soft cinematic spotlight highlighting her delicate face and glowing skin. Atmosphere: festive, romantic, dreamy. High detail, sharp focus, 8K UHD, pastel cinematic tones.",
"She is sitting gracefully among the decorations, holding a traditional paper fan beside her face, revealing only her expressive eyes looking at the camera. The sheer red fabric drapes around her. The lighting is soft and diffused, creating a mysterious and alluring mood. Elegant, artistic, 8K UHD.",
"A full-body shot where she stands with one hand on her waist and the other gently holding the flowing red skirt, as if she is about to dance. She looks to the side with a happy, carefree expression. The suspended koi fish and lanterns create a dynamic, three-dimensional background. Joyful, graceful, 8K UHD.",
"A serene portrait where she is gazing softly at the camera with her hands folded gently near her chest. The focus is tight on her delicate face and the floral pattern of the áo yếm. The background is a soft blur of red lanterns and fabric. Pure, romantic, 8K UHD.",
"She is interacting with the set, gently touching one of the large suspended paper koi fish, looking up at it with a sense of wonder. The lighting creates a beautiful rim light around her hair and profile. The atmosphere is magical and dreamlike. Whimiscal, cinematic, 8K UHD."
]
},
// Yếm Trung Thu
{
id: 'yem-trung-thu',
name: 'Yếm Trung Thu',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"Ultra realistic portrait of a young Vietnamese woman in a vibrant orange dragonfly-patterned áo yếm and skirt. Her long black hair is in a thick, elaborate braid with red tassels. She stands before a festive wall of colorful miniature lion dance heads, looking over her shoulder with a gentle gaze. Soft lighting highlights the details of her outfit. Mood: Playful and elegant. 8K UHD, cinematic.",
"Ultra realistic portrait of a young Vietnamese woman in an orange dragonfly-patterned áo yếm. Seated in profile, her eyes are closed, one hand to her face. A giant, glowing full moon provides dramatic backlighting, creating a warm, ethereal halo. Atmosphere: Dreamy, contemplative, magical. 8K UHD, sharp focus on her profile.",
"Ultra realistic full-body portrait of a young Vietnamese woman in an orange dragonfly-patterned áo yếm. She stands confidently before a massive glowing full moon, holding an orange lion dance head. The background is framed by red lanterns and paper fish. Lighting is a mix of backlight and soft frontal light. Atmosphere: Powerful and festive. 8K UHD.",
"Ultra realistic portrait of a young Vietnamese woman in an elegant orange dragonfly-patterned áo yếm. She reclines gracefully on a rustic bamboo bench, surrounded by straw and traditional fishing baskets. She looks at the camera with a calm, alluring expression. Lighting is soft and natural, emphasizing textures. Mood: Rustic elegance. 8K UHD.",
"Ultra realistic close-up portrait from the chest up. A young Vietnamese woman in an orange dragonfly-patterned áo yếm, her elaborate braid visible. She holds two small, colorful lion dance heads on either side of her face, smiling playfully at the camera. The background is a soft blur of festive lights. Lighting is bright and joyful. 8K UHD."
]
},
{
id: 'viet-phuc-serenity',
name: 'Việt Phục Cổ Trang',
category: 'Lễ Hội & Truyền Thống',
prompts: [
"Dáng 1: Đứng trên cầu. Chân dung siêu thực của một thiếu nữ Việt Nam mặc áo tấc màu kem thêu hoa tinh xảo, đội nón ba tầm. Nàng đứng trên một cây cầu đá cổ kính trong khu vườn thượng uyển, tay cầm nón, ánh mắt nhìn xuống mặt hồ tĩnh lặng. Bối cảnh là cây tùng, núi đá và sương sớm mờ ảo. Ánh sáng bình minh dịu nhẹ, không khí thanh tao, trong trẻo. Chi tiết cực cao, phong cách điện ảnh, 8K UHD.",
"Dáng 2: Giữa hồ sen. Chân dung toàn thân siêu thực của một thiếu nữ Việt Nam mặc áo tấc màu kem, đội nón ba tầm, đứng trên một lối đi đá nhỏ giữa hồ sen. Nàng cầm một bó sen trắng, ánh mắt nhìn thẳng vào ống kính với vẻ đẹp dịu dàng. Bối cảnh là hồ sen rộng lớn với lá và hoa sen hồng. Ánh sáng chiều vàng ấm áp, không khí lãng mạn. Chi tiết cực cao, 8K UHD.",
"Dáng 3: Tựa lan can. Chân dung siêu thực của một thiếu nữ Việt Nam trong trang phục áo tấc, ngồi duyên dáng trên lan can đá của một hành lang cổ. Nàng đội nón ba tầm, ánh mắt nhìn xa xăm về phía hồ sen. Trang sức ngọc bích tinh tế. Ánh sáng mềm mại chiếu từ một bên, tạo khối cho khuôn mặt và trang phục. Không khí trầm mặc, hoài cổ. Phong cách điện ảnh, 8K UHD.",
"Dáng 4: Chân dung cận cảnh. Chân dung cận cảnh siêu thực của thiếu nữ Việt Nam mặc áo tấc, đội nón ba tầm. Tiêu điểm tập trung vào vẻ đẹp thanh tú, lớp trang điểm nhẹ nhàng và trang sức ngọc bích. Ánh mắt nhìn thẳng, biểu cảm trong sáng. Hậu cảnh là cây xanh mờ ảo. Ánh sáng dịu, làm nổi bật làn da không tì vết. Chi tiết cực cao, 8K.",
"Dáng 5: Nhìn nghiêng. Chân dung siêu thực, thiếu nữ Việt Nam mặc áo tấc, đội nón ba tầm, đứng bên lan can đá. Nàng quay người nhìn nghiêng qua vai với một biểu cảm dịu dàng, kín đáo. Tà áo bay nhẹ trong gió. Bối cảnh là khu vườn cổ với cây cối xanh mướt. Ánh sáng hoàng hôn mềm mại. Không khí thanh bình, 8K UHD."
]
},
{
id: 'cuoi-eats-rabbit',
name: 'Chú cuội ăn Thỏ',
category: 'Lễ Hội & Truyền Thống',
numPortraits: 2,
isFamilyPrompt: true,
prompts: [
"Dáng 1: Cảnh hài hước đêm Trung thu Việt Nam. Dưới ánh trăng rằm, chàng trai trẻ ([face1]) ngồi bên bàn ngoài sân, vui vẻ cắn miếng thỏ quay trông như heo sữa quay vàng giòn bốc khói. Bên cạnh, Hằng Nga ([face2]) mặc áo lụa trắng thướt tha đang khóc nức nở, miệng mếu máo, nước mắt giàn giụa, đau lòng nhìn con thỏ. Bàn đầy bánh trung thu, đèn lồng và trà. Ánh sáng vàng ấm áp, chi tiết, chủ nghĩa hiện thực điện ảnh, tông màu hài hước nhưng cổ tích, chi tiết cao, độ phân giải 4K.",
"Dáng 2: Chú Cuội ([face1]) giơ con thỏ quay về phía Chị Hằng ([face2]) với vẻ mặt mời mọc tinh nghịch. Chị Hằng ([face2]) quay mặt đi, tay lau nước mắt, vẻ mặt vừa giận vừa thương. Cảnh đêm Trung Thu, trăng rằm, bàn tiệc. Ánh sáng điện ảnh, hài hước, 4K.",
"Dáng 3: Cận cảnh Chị Hằng ([face2]) đang khóc, nước mắt giàn giụa, tay ôm mặt. Phía sau, bóng Chú Cuội ([face1]) đang ăn con thỏ bị làm mờ đi. Ánh trăng chiếu vào khuôn mặt đầy nước mắt của Chị Hằng, tạo nên một cảnh vừa bi vừa hài. Chi tiết cao, điện ảnh, 4K.",
"Dáng 4: Chú Cuội ([face1]) ngừng ăn, nhìn Chị Hằng ([face2]) đang khóc với vẻ mặt ngơ ngác, không hiểu chuyện gì. Một tay vẫn cầm con thỏ quay, tay kia gãi đầu. Bối cảnh đêm Trung thu lãng mạn tương phản với tình huống hài hước. Ánh sáng vàng, 4K.",
"Dáng 5: Toàn cảnh sân đình đêm Trung Thu. Chú Cuội ([face1]) và Chị Hằng ([face2]) ngồi ở hai đầu bàn. Cuội đang gặm thỏ, Hằng đang khóc. Xung quanh là đèn lồng treo cao, trăng rằm sáng tỏ. Không khí vừa lãng mạn vừa éo le. Chi tiết, điện ảnh, 4K."
]
},
// Hoài niệm ký ức
{
id: 'memory-lane',
name: 'Hoài niệm ký ức',
category: 'Gia Đình & Cặp Đôi',
numPortraits: 2,
isFamilyPrompt: true,
prompts: [
"Dáng 1: Tựa tường nhìn nhau. Cinematic photorealistic full-body, adult meets childhood self in an old alley with a big mango tree. Side view: the adult leans on a wall, gazing softly at their childhood self. The child looks up at the adult with admiration. The scene is bathed in the warm light of the golden hour, creating long shadows and a nostalgic mood. QUAN TRỌNG TỐI CAO: Giữ lại chính xác 100% các đặc điểm trên khuôn mặt của người lớn ([face1]) và trẻ em ([face2]) từ các bức ảnh đã tải lên. Không được thay đổi, chỉnh sửa hay làm đẹp khuôn mặt. Mục tiêu là một sự sao chép chân thực và chính xác tuyệt đối, giữ lại mọi chi tiết như hình dạng mắt, mũi, miệng và các đặc điểm riêng biệt. Tái tạo lại khuôn mặt một cách chân thực nhất có thể bằng cách sử dụng tất cả các ảnh tham chiếu được cung cấp cho mỗi người. Vertical 9:16, realistic skin, natural expressions, cinematic depth, warm tones.",
"Dáng 2: Ngồi trên ghế dài. Cinematic photorealistic full-body, adult and childhood self sit side-by-side on a rustic wooden bench under a large mango tree in an old alley. The adult ([face1]) has a gentle arm around the child's ([face2]) shoulder, both looking towards the same point off-camera with soft smiles. The child holds a small, vintage toy car. The scene is bathed in the warm light of the golden hour, creating long shadows and a nostalgic mood. QUAN TRỌNG TỐI CAO: Giữ lại chính xác 100% các đặc điểm trên khuôn mặt của người lớn ([face1]) và trẻ em ([face2]) từ các bức ảnh đã tải lên. Không được thay đổi, chỉnh sửa hay làm đẹp khuôn mặt. Mục tiêu là một sự sao chép chân thực và chính xác tuyệt đối, giữ lại mọi chi tiết như hình dạng mắt, mũi, miệng và các đặc điểm riêng biệt. Tái tạo lại khuôn mặt một cách chân thực nhất có thể bằng cách sử dụng tất cả các ảnh tham chiếu được cung cấp cho mỗi người. Vertical 9:16, realistic skin, natural expressions, cinematic depth, warm tones.",
"Dáng 3: Chơi xích đu. Cinematic photorealistic full-body, adult ([face1]) gently pushes their childhood self ([face2]) on a simple rope swing hanging from a large mango tree in an old alley. The child is laughing with joy, looking back at the adult who is smiling warmly. The scene is captured mid-motion, filled with the warm light of the golden hour, creating dappled light through the leaves and a joyful, nostalgic mood. QUAN TRỌNG TỐI CAO: Giữ lại chính xác 100% các đặc điểm trên khuôn mặt của người lớn ([face1]) và trẻ em ([face2]) từ các bức ảnh đã tải lên. Không được thay đổi, chỉnh sửa hay làm đẹp khuôn mặt. Mục tiêu là một sự sao chép chân thực và chính xác tuyệt đối, giữ lại mọi chi tiết như hình dạng mắt, mũi, miệng và các đặc điểm riêng biệt. Tái tạo lại khuôn mặt một cách chân thực nhất có thể bằng cách sử dụng tất cả các ảnh tham chiếu được cung cấp cho mỗi người. Vertical 9:16, realistic skin, natural expressions, cinematic depth, warm tones.",
"Dáng 4: Thì thầm. Cinematic photorealistic, adult ([face1]) is kneeling down to the same height as their childhood self ([face2]) in an old alley next to a large mango tree. The child is leaning in close, cupping a hand to whisper in the adult's ear. The adult is listening intently with a warm, loving smile. The scene is intimate, bathed in the warm light of the golden hour, creating soft shadows and a heartwarming, nostalgic mood. QUAN TRỌNG TỐI CAO: Giữ lại chính xác 100% các đặc điểm trên khuôn mặt của người lớn ([face1]) và trẻ em ([face2]) từ các bức ảnh đã tải lên. Không được thay đổi, chỉnh sửa hay làm đẹp khuôn mặt. Mục tiêu là một sự sao chép chân thực và chính xác tuyệt đối, giữ lại mọi chi tiết như hình dạng mắt, mũi, miệng và các đặc điểm riêng biệt. Tái tạo lại khuôn mặt một cách chân thực nhất có thể bằng cách sử dụng tất cả các ảnh tham chiếu được cung cấp cho mỗi người. Vertical 9:16, realistic skin, natural expressions, cinematic depth, warm tones.",
"Dáng 5: Nắm tay bước đi. Cinematic photorealistic, view from behind. Adult ([face1]) and childhood self ([face2]) walk hand-in-hand down an old alley, away from the camera, under a large mango tree. Their long shadows stretch out before them on the sun-drenched ground. The adult is slightly turned, looking down at the child with a fond expression. The scene is bathed in the warm light of the golden hour, creating a poignant and nostalgic mood. QUAN TRỌNG TỐI CAO: Giữ lại chính xác 100% các đặc điểm trên khuôn mặt của người lớn ([face1]) và trẻ em ([face2]) từ các bức ảnh đã tải lên. Không được thay đổi, chỉnh sửa hay làm đẹp khuôn mặt. Mục tiêu là một sự sao chép chân thực và chính xác tuyệt đối, giữ lại mọi chi tiết như hình dạng mắt, mũi, miệng và các đặc điểm riêng biệt. Tái tạo lại khuôn mặt một cách chân thực nhất có thể bằng cách sử dụng tất cả các ảnh tham chiếu được cung cấp cho mỗi người. Vertical 9:16, realistic skin, natural expressions, cinematic depth, warm tones."
]
},
{
id: 'gia-dinh-cay-xoai',
name: 'Gia đình cây xoài',
category: 'Gia Đình & Cặp Đôi',
isFamilyPrompt: true,
prompts: [
"Dáng 1: Chân dung gia đình. Cinematic photorealistic full-body, cả gia đình (người lớn và trẻ em) đang tạo dáng chụp ảnh cùng nhau dưới một gốc cây xoài lớn trong một con ngõ cũ. Người lớn có thể đứng hoặc ngồi, trẻ em ở phía trước. Mọi người đều mỉm cười ấm áp nhìn vào máy ảnh. Ánh sáng vàng của buổi hoàng hôn, không khí hoài niệm. Vertical 9:16.",
"Dáng 2: Cùng nhau đi dạo. Cinematic photorealistic, góc nhìn từ phía sau. Cả gia đình đang nắm tay nhau đi dạo trên con đường làng, xa dần máy ảnh, dưới tán cây xoài. Bóng của họ đổ dài về phía trước. Cảnh hoàng hôn ấm áp, không khí yên bình và gắn kết. Vertical 9:16.",
"Dáng 3: Kể chuyện. Cinematic photorealistic. Một người lớn đang ngồi dựa vào gốc cây xoài, cầm một cuốn sách và đọc truyện cho những đứa trẻ đang ngồi quây quần xung quanh lắng nghe một cách chăm chú. Những người lớn khác có thể ngồi cạnh, mỉm cười quan sát. Ánh nắng hoàng hôn xuyên qua kẽ lá, tạo nên một khung cảnh ấm cúng. Vertical 9:16.",
"Dáng 4: Picnic. Cinematic photorealistic. Gia đình đang có một buổi picnic vui vẻ trên một tấm thảm trải dưới gốc cây xoài. Có một giỏ trái cây, bánh mì. Mọi người đang cười đùa, trò chuyện. Một đứa trẻ có thể đang với lấy một quả xoài. Không khí vui vẻ, hạnh phúc. Ánh sáng hoàng hôn. Vertical 9:16.",
"Dáng 5: Chơi thả diều. Cinematic photorealistic. Trên một cánh đồng gần con ngõ có cây xoài, một người lớn và một đứa trẻ đang cùng nhau thả một con diều. Những thành viên khác trong gia đình đứng gần đó cổ vũ và mỉm cười. Bầu trời hoàng hôn rực rỡ. Không khí năng động, đầy ắp tiếng cười. Vertical 9:16."
]
},
{
id: 'loving-family',
name: 'gia đình yêu thương❤',
category: 'Gia Đình & Cặp Đôi',
isFamilyPrompt: true,
simpleFamilyMode: true,
prompts: [
"Dáng 1: Cuộc chiến gối. Một bức ảnh chân thực, rõ ràng theo phong cách máy ảnh polaroid, có hiệu ứng mờ nhẹ và ánh sáng flash. Gia đình đang có một trận chiến gối vui nhộn trên giường, lông vũ bay tung tóe. Mọi người đều cười sảng khoái. Bối cảnh phòng ngủ ấm cúng với rèm trắng.",
"Dáng 2: Xem lại kỷ niệm. Một bức ảnh chân thực, rõ ràng theo phong cách máy ảnh polaroid, có hiệu ứng mờ nhẹ và ánh sáng flash. Gia đình đang quây quần trên sàn nhà, cùng nhau xem một cuốn album ảnh cũ. Mọi người chỉ trỏ và mỉm cười khi nhớ lại những kỷ niệm. Ánh sáng ấm áp từ đèn bàn chiếu rọi. Rèm cửa màu trắng.",
"Dáng 3: Bếp vui nhộn. Một bức ảnh chân thực, rõ ràng theo phong cách máy ảnh polaroid, có hiệu ứng mờ nhẹ và ánh sáng flash. Cả gia đình đang cùng nhau làm bánh trong bếp, bột mì dính trên mặt và quần áo. Mọi người đang cười đùa với nhau. Bối cảnh nhà bếp có rèm trắng.",
"Dáng 4: Xây pháo đài. Một bức ảnh chân thực, rõ ràng theo phong cách máy ảnh polaroid, có hiệu ứng mờ nhẹ và ánh sáng flash. Gia đình đang ở bên trong một 'pháo đài' tự làm từ chăn và gối trong phòng khách. Mọi người chen chúc nhìn ra ngoài và cười. Ánh sáng từ đèn pin tạo nên không khí phiêu lưu. Rèm cửa trắng phía sau.",
"Dáng 5: Khiêu vũ trong phòng khách. Một bức ảnh chân thực, rõ ràng theo phong cách máy ảnh polaroid, có hiệu ứng mờ nhẹ và ánh sáng flash. Cả gia đình đang nhảy múa một cách ngẫu hứng và vui nhộn trong phòng khách. Khoảnh khắc trànầy năng lượng và tiếng cười. Bối cảnh có rèm trắng."
]
},
{
id: 'dai-duong',
name: 'Lơ Lửng giữa đại dương',
category: 'Concept Nghệ Thuật',
prompts: [
"Dáng 1: Một cảnh dưới nước siêu thực và bí ẩn. Một bóng người nam đơn độc, mặc trang phục lụa mỏng nhẹ, bồng bềnh, duyên dáng thả mình trên lưng trong một vực thẳm đại dương bao la, tối tăm, trống rỗng. Anh ấy ở vị trí hơi lệch về bên trái, cơ thể cong một cách thanh lịch, mặt và mắt hướng lên trên về phía một chùm ánh sáng mặt trời duy nhất, tập trung xuyên qua mặt nước từ ngay phía trên. Anh ấy đeo kính, và một tay nhẹ nhàng vươn lên, gần như chạm tới ánh sáng. Mái tóc ngắn của anh ấy bồng bềnh tự nhiên theo dòng nước nhẹ. Góc máy thấp, nhìn lên trên về phía mặt nước, nhấn mạnh sự lơ lửng của anh ấy giữa vực sâu không xác định và ánh sáng dẫn lối. Không khí tổng thể siêu thực, bí ẩn và thanh thản. Độ phân giải 8K chi tiết cao.",
"Dáng 2: Một cảnh dưới nước siêu thực. Một người nam đơn độc mặc lụa bồng bềnh và đeo kính, bơi một cách duyên dáng lên trên về phía một chùm ánh sáng mặt trời duy nhất. Cơ thể anh ấy hướng về phía ánh sáng, cánh tay duỗi ra trong một cú sải tay nhẹ nhàng, thể hiện một cảm giác quyết tâm thanh thản. Góc máy từ bên dưới nhấn mạnh hành trình của anh ấy từ vực thẳm tối tăm, không có đặc điểm gì, lên trên. Ánh sáng chiếu rọi khuôn mặt và con đường phía trước của anh ấy. Bầu không khí đầy hy vọng và siêu thực. Độ phân giải 8K chi tiết cao.",
"Dáng 3: Một vực thẳm dưới nước bí ẩn. Một người nam đơn độc trong trang phục lụa mỏng và đeo kính lơ lửng trong tư thế bào thai yên bình trong một chùm ánh sáng mặt trời hình nón sắc nét. Đôi mắt anh ấy nhắm lại, khuôn mặt nghiêng về phía ánh sáng, một vẻ thanh thản sâu sắc. Tấm vải bồng bềnh nhẹ nhàng bao bọc anh ấy. Cảnh tượng gợi lên cảm giác tái sinh và sự cô độc tĩnh lặng. Góc máy thấp, nhìn lên trên, nhấn mạnh sự tương phản giữa sự an toàn trong ánh sáng và sự bao la của bóng tối. Độ phân giải 8K chi tiết cao.",
"Dáng 4: Một khoảng không dưới nước kỳ lạ và siêu thực. Một chùm ánh sáng mặt trời duy nhất xuyên qua bóng tối, chiếu sáng lưng của một người nam đơn độc trong trang phục lụa bồng bềnh và đeo kính. Anh ấy lơ lửng theo chiều dọc, hướng mặt xuống dưới, nhìn chằm chằm vào vực thẳm đen vô tận bên dưới. Khuôn mặt anh ấy chìm trong bóng tối sâu thẳm, tạo ra một cảm giác bí ẩn và nội tâm mạnh mẽ. Ánh sáng bắt lấy các cạnh của tóc và quần áo anh ấy, nhưng bóng tối lại vẫy gọi. Độ phân giải 8K chi tiết cao.",
"Dáng 5: Một cảnh dưới nước thanh thản và siêu thực. Trong một cột ánh sáng mặt trời hoàn hảo, một người nam đơn độc lơ lửng với hai tay dang rộng sang hai bên, như trong trạng thái hoàn toàn buông xuôi. Anh ấy mặc lụa mỏng nhẹ, bồng bềnh và đeo kính, khuôn mặt hướng lên ánh sáng với một biểu cảm yên bình. Máy quay nhìn lên từ xa, ghi lại tư thế hình chữ thập của anh ấy trên nền khoảng không đại dương bao la, tối tăm. Một vài bong bóng lung linh bay lên xung quanh anh ấy, tăng thêm không khí thanh tao và tâm linh. Độ phân giải 8K chi tiết cao."
]
},
{
id: 'studio-portrait',
name: 'chân dung studio nền đỏ',
category: 'Nàng Thơ & Studio',
prompts: [
"Dáng 1: Chân dung nửa người, chụp từ góc thấp hướng lên để tôn lên đường xương hàm và cổ. Người mẫu nam mặc vest đen và áo sơ mi đen. Nền màu đỏ thẫm. Ánh sáng điện ảnh: một bên mặt có highlight vàng, bên còn lại chìm trong bóng tối sâu, tạo độ tương phản mạnh. Ống kính 85mm, độ sâu trường ảnh nông. Khuôn mặt siêu chi tiết, sắc nét, đôi mắt trong veo, kết cấu da chân thực, vẻ đẹp điêu khắc, toát lên sự thống trị trầm lặng. Ảnh dọc 1080x1920, độ nét cao.",
"Dáng 2: Cận cảnh khuôn mặt, ánh mắt nhìn thẳng vào ống kính đầy mãnh liệt. Người mẫu nam mặc áo sơ mi đen. Nền màu đỏ thẫm. Ánh sáng Chiaroscuro: một nguồn sáng vàng mềm mại duy nhất từ bên cạnh chiếu sáng một nửa khuôn mặt, nửa còn lại chìm trong bóng tối sâu thẳm. Lấy nét vào đôi mắt. Ống kính 85mm, độ sâu trường ảnh cực nông. Chi tiết cực cao, tập trung vào kết cấu da và đôi mắt. Toát lên vẻ nội tâm và quyền lực thầm lặng. Ảnh dọc 1080x1920.",
"Dáng 3: Chụp góc nghiêng ba phần tư, người mẫu nam mặc vest và áo sơ mi đen, nhìn ra xa khỏi máy ảnh. Đường xương hàm và góc nghiêng được xác định rõ nét. Nền màu đỏ thẫm. Ánh sáng viền vàng mạnh mẽ chạy dọc theo khuôn mặt, cổ và vai, tách anh ra khỏi nền tối. Phần lớn khuôn mặt chìm trong bóng tối. Ống kính 85mm, độ sâu trường ảnh nông. Thể hiện cảm giác trầm ngâm và vẻ đẹp điêu khắc. Ảnh dọc 1080x1920.",
"Dáng 4: Chân dung chụp từ ngực trở lên, đầu hơi cúi xuống, mắt nhìn xuống và ra xa như đang suy tư. Người mẫu nam mặc vest đen. Nền màu đỏ thẫm. Ánh sáng dịu hơn, từ trên cao và một bên, tạo ra vầng sáng vàng nhẹ trên tóc và sống mũi, với bóng đổ mềm mại trên gò má. Ống kính 85mm, độ sâu trường ảnh rất nông, lấy nét vào hàng mi. Tâm trạng cô độc nhưng tự tin, tĩnh lặng. Ảnh dọc 1080x1920.",
"Dáng 5: Chân dung nửa người, khuôn mặt hơi nghiêng sang một bên. Một vệt sáng vàng mạnh cắt ngang qua mắt và gò má, như ánh sáng lọt qua khe cửa, phần còn lại của khuôn mặt chìm trong bóng tối sâu. Nền màu đỏ thẫm. Ống kính 85mm, độ sâu trường ảnh nông. Sự tương phản gay gắt giữa ánh sáng và bóng tối tạo ra một không khí bí ẩn, mạnh mẽ. Lấy nét cực sắc vào phần được chiếu sáng của khuôn mặt. Ảnh dọc 1080x1920."
]
},
{
id: 'art-museum-portrait',
name: 'Chân dung tại Bảo tàng',
category: 'Concept Nghệ Thuật',
prompts: [
"Photorealistic art museum scene, wooden floor, cinematic warm spotlights; uploaded person from behind looking at a large ornate framed oil painting of themselves (romantic pastel oil painting style); ultra-detailed 8K.",
"Photorealistic art museum scene, soft gallery lighting. The uploaded person stands in profile, hands clasped behind their back, thoughtfully observing a large, ornately framed oil painting of themselves. The painting is in a romantic pastel style. The camera is positioned slightly to the side, capturing the person's contemplative expression. Wooden floor reflects the soft light. Ultra-detailed 8K.",
"Photorealistic art museum, gallery with a polished wooden bench in the center. The uploaded person is sitting on the bench, leaning forward slightly, gazing up at a massive, ornate-framed oil painting of themselves on the far wall. The painting is a romantic pastel masterpiece. Cinematic spotlights create a dramatic focus on the painting and the person. Ultra-detailed 8K.",
"Photorealistic art museum setting. A close-up shot over the shoulder of the uploaded person, focusing on the large, ornate-framed oil painting of themselves. The painting's texture is visible, rendered in a soft, romantic pastel style. The person's silhouette is softly blurred in the foreground. Warm, cinematic spotlights illuminate the artwork. Ultra-detailed 8K.",
"Photorealistic, grand art museum hall with high ceilings and marble columns, polished wooden floors. The uploaded person stands alone in the vast space, looking at a single, large, ornate-framed oil painting of themselves, which is spotlit. The painting is in a romantic pastel style. The scene feels grand and slightly solitary. Cinematic warm lighting. Ultra-detailed 8K."
]
},
{
id: 'car-muse',
name: 'Nàng thơ bên xe',
category: 'Concept Nghệ Thuật',
prompts: [
"Chân dung siêu thực của một phụ nữ Việt Nam trẻ đẹp ngồi trên ghế lái của một chiếc xe hơi cổ điển màu xanh đậm cổ kính. Cô mặc một chiếc váy cưới ren trắng không dây thanh lịch. Tóc cô được trang trí bằng những bông hoa vàng nhỏ và lá xanh. Cô ôm một bó hoa lan vàng rực rỡ rất lớn, tràn ra cả bên ngoài xe. Cửa xe mở, để lộ nội thất da màu nâu. Bối cảnh là một khu vườn xanh mướt, ngập nắng. Ánh sáng ấm áp và tự nhiên, tạo nên một không khí lãng mạn và mơ mộng. Điện ảnh, 8K UHD, lấy nét sắc sảo.",
"Ảnh chụp toàn thân siêu thực của một phụ nữ Việt Nam trẻ đẹp trong một chiếc xe hơi cổ điển. Cô mặc một chiếc váy cưới ren trắng bồng bềnh và cài hoa vàng trên tóc. Cô dựa lưng vào ghế da màu nâu, một tay đặt trên vô lăng, duyên dáng nhìn về phía máy ảnh. Một bó hoa vàng lớn đặt trên đùi cô. Khung cảnh khu vườn xanh mướt có thể nhìn thấy qua cửa xe và cửa sổ đang mở. Ánh sáng rực rỡ và nắng đẹp, làm nổi bật kết cấu của ren và hoa. Không khí thanh tao và trang nhã, 8K UHD, điện ảnh.",
"Chân dung siêu thực của một phụ nữ trẻ đang bước ra khỏi chiếc xe hơi cổ màu xanh đậm. Cô mặc một chiếc váy ren trắng tuyệt đẹp và cầm một bó hoa vàng lớn. Một chân cô đã đặt xuống đất khi cô nhìn qua vai với một nụ cười dịu dàng. Bối cảnh khu vườn xanh mướt và được tắm trong ánh nắng ấm áp. Cảnh chụp ghi lại khoảnh khắc chuyển động thanh lịch. Lãng mạn và điện ảnh, 8K UHD.",
"Chân dung siêu thực của một phụ nữ trẻ đứng cạnh một chiếc xe hơi cổ điển. Cô duyên dáng dựa vào thân xe màu xanh đậm, tay cầm bó hoa vàng. Chiếc váy ren trắng của cô tương phản tuyệt đẹp với màu sơn tối của xe. Khu vườn ngập nắng tạo nên một bối cảnh mềm mại, lãng mạn. Cô trầm ngâm nhìn xa xăm. Không khí mơ mộng và hoài niệm, 8K UHD.",
"Ảnh chụp cận cảnh vẻ đẹp siêu thực của một phụ nữ trẻ ngồi trong xe hơi cổ. Tiêu điểm tập trung vào biểu cảm thanh thản của cô và những bông hoa vàng tinh tế trên tóc. Cô đang cầm bó hoa lớn, với một vài bông hoa che một phần khuôn mặt. Ánh sáng tự nhiên, dịu nhẹ từ cửa xe mở chiếu sáng làn da không tì vết của cô. Nội thất da màu nâu của xe được làm mờ nhẹ ở hậu cảnh. Thân mật và lãng mạn, 8K UHD, ánh sáng điện ảnh."
]
},
{
id: 'chill-chill-oto',
name: 'Chill Chill Ôtô',
category: 'Concept Nghệ Thuật',
prompts: [
"Wong Kar-wai cinematic style. The subject sits inside an old taxi, head against the rain-streaked window. Streetlight refracts through the glass, casting blurred streaks of light across his face. Shot from outside, with reflections overlapping his contemplative expression. Red-green neon lights pass by, shifting the color palette. Mood of loneliness and solitude in a big city. Thick film grain, pronounced motion blur, hazy glow. The subject wears a black button-down shirt.",
"Wong Kar-wai cinematic style. Inside an old taxi on a rainy night. The subject, in a black shirt, looks into the rearview mirror, his face half-lit by passing red and green neon lights. The reflection shows his lonely eyes, while raindrops streak down the windshield in the background. Thick film grain, motion blur, hazy glow.",
"Wong Kar-wai cinematic style. Shot from the front seat of an old taxi. The subject sits in the back, looking out the rear window at the blurred, receding city lights. His silhouette is framed by the rain-streaked glass. The interior is dark, with occasional flashes of red and green neon illuminating his profile. Mood of solitude, thick film grain, hazy glow. He wears a black button-down shirt.",
"Wong Kar-wai cinematic style. A close-up shot of the subject's hand resting on the rain-streaked taxi window. His face is a soft, out-of-focus reflection in the glass, colored by passing neon lights. The focus is on the contrast between the warmth of his skin and the cold glass. Mood of quiet contemplation, thick film grain, red-green contrast. He wears a black button-down shirt.",
"Wong Kar-wai cinematic style. The taxi has stopped. The subject looks out the side window at a blurry, neon-lit destination. His face is illuminated by a mix of streetlight and colored signs, creating complex shadows. The rain has slowed to a drizzle on the window. A sense of ambiguous arrival, loneliness, thick film grain, hazy glow. He wears a black button-down shirt."
]
},
{
id: 'titanic-legend',
name: 'Titanic huyền thoại',
category: 'Concept Nghệ Thuật',
numPortraits: 1,
prompts: [
"A hyper-realistic close-up group photo, natural daylight, realistic skin tones. The subject (keep the uploaded face) wears a white cap, dark sunglasses, black vest with a white tie, black trousers and polished black western shoes. He is standing next to Jack (Leonardo DiCaprio) and Rose (Kate Winslet) in their iconic Titanic costumes. All three smile naturally, standing close together like a straightforward group selfie. They are positioned in front of the moored Titanic, its massive steel hull towering in the background. The ship’s name “TITANIC” is clearly painted in bold letters on the side. The hull plating texture is finely detailed, period-accurate, with rivets and weathered metallic shine. The atmosphere feels historic yet authentic, blending cinematic aura with the look of an ordinary snapshot. The composition resembles a slightly imperfect iPhone photo: sharp clothes detail, lifelike skin, natural depth of field, subtle daylight shadowing. The scene feels grounded, as if casually captured in front of the legendary ship rather than a polished movie still. Ultra-detailed, photorealistic, cinematic lighting, authentic 1912 period styling, 8K resolution.",
"A hyper-realistic, action-shot style photo from the bow of the Titanic. Jack (Leonardo DiCaprio) and Rose (Kate Winslet) are in their famous 'I'm flying' pose at the very front rail. The subject (keep the uploaded face), wearing a white cap, dark sunglasses, black vest, and black trousers, stands just behind them with a wide, joyful grin, photobombing the iconic moment. The vast ocean stretches out behind them, with the sky showing a beautiful sunset. The composition feels like a candid, slightly shaky snapshot taken by a friend. Natural daylight, realistic skin tones, subtle motion blur on the water. Ultra-detailed, photorealistic, cinematic lighting, authentic 1912 period styling, 8K resolution.",
"A hyper-realistic candid photo on the docks next to the moored Titanic. The subject (keep the uploaded face) in a white cap, sunglasses, black vest and trousers, is laughing heartily alongside Jack (Leonardo DiCaprio) and Rose (Kate Winslet). Jack is in the middle of telling a story, gesturing with his hands, while Rose listens with a smile. They are leaning against some wooden cargo crates. The massive hull of the Titanic fills the background, its name clearly visible. The lighting is bright, natural daylight, casting realistic shadows. The scene feels like a captured moment of friendship, not a posed picture. Lifelike skin, sharp details on clothing, authentic 1912 period styling, 8K resolution.",
"A hyper-realistic photo taken from the perspective of someone on the dock, looking up at the Titanic's deck. The subject (keep the uploaded face), wearing a white cap, sunglasses, and black vest, stands between Jack (Leonardo DiCaprio) and Rose (Kate Winslet) at the ship's railing. All three are smiling and waving enthusiastically towards the camera, as if saying goodbye as the great ship is about to depart. Streamers and confetti might be subtly visible in the air. The atmosphere is energetic and full of excitement. Natural daylight, realistic skin tones, authentic 1912 period styling, 8K resolution.",
"A hyper-realistic, opulent indoor photo on the Grand Staircase of the Titanic. The subject (keep the uploaded face), in their modern outfit of a white cap, sunglasses, black vest, and trousers, stands confidently on a step between Jack (Leonardo DiCaprio) in his tuxedo and Rose (Kate Winslet) in her elegant evening gown. The contrast between the subject's modern attire and the formal 1912 setting is a key element. They are all looking at the camera for a formal group portrait. The iconic 'Honor and Glory Crowning Time' clock is visible in the background. The lighting is warm and grand, coming from the ornate light fixtures. The scene blends cinematic grandeur with a touch of modern anachronism. Ultra-detailed, photorealistic, cinematic lighting, 8K resolution."
]
},
{
id: 'gucci-fashion-editorial',
name: 'Gucci Fashion Editorial',
category: 'Fashion & Phong Cách',
prompts: [
"RAW photo, ultra-realistic, high dynamic range, full-body cinematic fashion editorial. A confident person stands against a stark, dark background, dramatically illuminated by a bold, intense red frontal key light that wraps softly around their form, enhancing the textures and rich details of the outfit. Wearing an opulent Gucci-inspired ensemble: a tailored emerald green velvet blazer with intricate gold embroidery, paired with high-waisted cream wide-leg trousers with a flawless crease. Under the blazer, a silky champagne blouse with a soft drape and subtle sheen. Statement accessories include a chunky gold chain necklace, oversized tinted sunglasses, and a slim leather belt with an iconic GG buckle. On the feet, sleek polished black loafers with gold hardware. Rich textures — velvet, silk, leather — are captured in exquisite detail, showing stitching, folds, and realistic reflections. Lighting emphasizes depth and contour, creating a moody, high-fashion atmosphere. Shot with Leica SL2 + APO-Summicron-SL 90mm f/2 ASPH lens, ISO 100, f/1.8, 1/250 sec, professional Vogue-style composition. 9:16 ratio.",
"RAW photo, ultra-realistic, cinematic fashion editorial. The confident person is seated on a minimalist black cube against a stark, dark background. Dramatically illuminated by a bold, intense red frontal key light. Wearing a Gucci-inspired emerald green velvet blazer with gold embroidery, cream wide-leg trousers, and a silky champagne blouse. The pose is relaxed yet powerful, one leg crossed, showcasing sleek black loafers. Oversized sunglasses and a chunky gold chain complete the look. Moody, high-fashion atmosphere. Shot with Leica SL2, 90mm f/2 lens, professional Vogue-style composition. 9:16 ratio.",
"RAW photo, ultra-realistic, cinematic fashion editorial, waist-up portrait. The person looks directly at the camera with a piercing gaze, illuminated by a bold, red key light against a dark backdrop. The focus is on the opulent Gucci-inspired emerald green velvet blazer, its intricate gold embroidery, and the silky champagne blouse beneath. A chunky gold chain necklace and oversized tinted sunglasses add to the high-fashion aesthetic. Moody atmosphere. Shot with Leica SL2, 90mm f/2 lens, professional Vogue-style composition. 9:16 ratio.",
"RAW photo, ultra-realistic, full-body cinematic fashion editorial, shot from a low angle. A confident person stands tall against a dark background, projecting power. A dramatic red frontal light highlights the Gucci-inspired ensemble: emerald green velvet blazer, cream wide-leg trousers, and black loafers. The low angle elongates the figure and emphasizes the flawless tailoring. Moody, high-fashion atmosphere. Shot with Leica SL2, 90mm f/2 lens, professional Vogue-style composition. 9:16 ratio.",
"RAW photo, ultra-realistic, full-body cinematic fashion editorial. The person is captured in profile, looking off-camera with a contemplative expression. A dramatic red light sculpts their form against a stark, dark background. The opulent Gucci-inspired outfit—emerald green velvet blazer, cream trousers, champagne blouse—is shown from the side, highlighting the silhouette and texture. Moody, high-fashion atmosphere. Shot with Leica SL2, 90mm f/2 lens, professional Vogue-style composition. 9:16 ratio."
]
},
{
id: 'white-shirt-dress-outfit',
name: 'Outfit váy sơ mi trắng',
category: 'Nàng Thơ & Studio',
prompts: [
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is standing straight, holding a bag of flowers. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is sitting on a white pedestal, one leg propped up casually. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic close-up studio portrait of a young woman in a short white dress, long wavy dark hair, soft natural makeup. She is resting her chin on her hand, looking thoughtfully at the camera. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is sitting down, hugging a bag of flowers to her chest, looking closely and gently at the camera. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is spreading her arms wide with a joyful, happy expression. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is bending down and leaning slightly to hold a bag of flowers on the floor. Minimal white background, photorealistic, ultra-detailed, 8K UHD.",
"Cinematic studio portrait of a young woman in a short white dress and sneakers, long wavy dark hair, soft natural makeup. She is sitting in a relaxed pose, with her eyes closed and a serene smile on her face. Minimal white background, photorealistic, ultra-detailed, 8K UHD."
]
},
{
id: 'single-bride',
name: 'cô dâu đơn',
category: 'Nàng Thơ & Studio',
prompts: [
"Bridal photoshoot of a beautiful bride in an elegant long-sleeved A-line lace wedding gown with a wide flare. She is looking slightly to the side with a gentle expression. Flawless makeup, delicate hairstyle with veil. Cinematic outdoor garden backdrop with lush greenery and white flowers, photorealistic, ultra-detailed, 8K UHD.",
"Bridal photoshoot of a beautiful bride sitting on the lush green grass. Her elegant wedding gown flares out, swirling in a perfect circle around her. Flawless makeup, delicate hairstyle with veil. Cinematic outdoor garden backdrop with white flowers, photorealistic, ultra-detailed, 8K UHD.",
"Bridal photoshoot of a beautiful bride in a solemn, straight standing pose. She wears an elegant wedding gown, her hands clasped gracefully in front of the dress. Flawless makeup, delicate hairstyle with veil. Cinematic outdoor garden backdrop with lush greenery and white flowers, photorealistic, ultra-detailed, 8K UHD.",
"Bridal photoshoot of a beautiful bride in a modern, sleeveless satin wedding gown featuring large ruffles at the chest and a thin, delicate veil draped across her shoulders. Flawless makeup, elegant hairstyle. Cinematic outdoor garden backdrop with lush greenery and white flowers, photorealistic, ultra-detailed, 8K UHD.",
"Bridal photoshoot of a beautiful bride sitting with her back to the camera. Her elegant flared wedding gown spreads out beautifully behind her. She turns her head over her shoulder to give a gentle, warm smile. Flawless makeup, delicate hairstyle with veil. Cinematic outdoor garden backdrop with lush greenery and white flowers, photorealistic, ultra-detailed, 8K UHD."
]
},
{
id: 'by-the-window',
name: 'Bên cửa sổ',
category: 'Nàng Thơ & Studio',
prompts: [
"Ultra realistic, modern studio style portrait. A young woman is sitting comfortably on a bed with soft white sheets. She wears an oversized pure white shirt, light blue wide-leg jeans, and white socks. The background is a bright room with natural light gently streaming through a window with white horizontal blinds. A few magazines and a pair of black headphones are placed next to the subject. The overall feeling is gentle, pure, and youthful. 8K UHD, cinematic soft light.",
"Ultra realistic, modern studio style portrait. A young woman kneels on the soft white bed, gazing thoughtfully out the window with its white blinds. The gentle sunlight highlights her profile. She is dressed in an oversized white shirt and light blue wide-leg jeans. The atmosphere is serene and introspective. 8K UHD, cinematic lighting.",
"Ultra realistic, modern studio style portrait. A young woman leans against a pillow on the white bed, focused on a magazine she holds. She wears an oversized white shirt and light blue wide-leg jeans. Black headphones rest on the sheets nearby. The room is filled with soft, natural light from the window. The mood is quiet and relaxed. 8K UHD, cinematic soft light.",
"Ultra realistic, modern studio style portrait. A young woman lies on her stomach on the white bed, wearing black headphones and smiling softly. Her outfit is an oversized white shirt and light blue jeans. Soft sunlight filters through the window blinds, creating a warm and cheerful atmosphere. The feeling is relaxed and joyful. 8K UHD, cinematic soft light.",
"Ultra realistic, close-up portrait. A young woman sits on the white bed, hugging her knees to her chest and looking at the camera with a gentle smile. She wears a simple oversized white shirt. The background is a soft-focus view of the bright room and window. The lighting is soft and flattering, creating an intimate and pure mood. 8K UHD, cinematic."
]
},
{
id: 'louis-vuitton-blazer',
name: 'Blazer Louis Vuitton',
category: 'Fashion & Phong Cách',
numPortraits: 1,
prompts: [
"Dáng 1: Tay đan trước. Ultra realistic fashion editorial portrait of a beautiful young Asian woman. She wears a sophisticated, brown, double-breasted blazer with a pattern of gold Louis Vuitton monogram prints, gold buttons, and a small gold brooch on the lapel, over a matching top. She wears black leather gloves and small gold earrings. Her dark brown hair is in a high, messy bun. Her hands are clasped together in front of her as she looks directly at the camera with a neutral, confident expression. Plain white studio background. Professional, even, shadowless lighting. 8K UHD, high fashion.",
"Dáng 2: Nhìn qua vai. Ultra realistic fashion editorial portrait of a beautiful young Asian woman. She wears a sophisticated, brown, double-breasted blazer with a pattern of gold Louis Vuitton monogram prints, gold buttons, and a small gold brooch on the lapel, over a matching top. She wears black leather gloves and small gold earrings. Her dark brown hair is in a high, messy bun. She looks over her shoulder at the camera with a chic, powerful gaze. Plain white studio background. Professional, even, shadowless lighting. 8K UHD, high fashion.",
"Dáng 3: Ngồi trên ghế. Ultra realistic fashion editorial portrait of a beautiful young Asian woman. She wears a sophisticated, brown, double-breasted blazer with a pattern of gold Louis Vuitton monogram prints, gold buttons, and a small gold brooch on the lapel, over a matching top. She wears black leather gloves and small gold earrings. Her dark brown hair is in a high, messy bun. She is sitting elegantly on a minimalist black stool, one hand resting on her knee. Plain white studio background. Professional, even, shadowless lighting. 8K UHD, high fashion.",
"Dáng 4: Chân dung cận. Ultra realistic close-up beauty portrait of a beautiful young Asian woman. She wears a sophisticated, brown, double-breasted blazer with a pattern of gold Louis Vuitton monogram prints and a small gold brooch. She wears black leather gloves and small gold earrings. Her dark brown hair is in a high, messy bun. Focus is on her elegant makeup with pinkish-red lipstick. She looks at the camera with a serene expression. Plain white studio background. Professional, even, shadowless lighting. 8K UHD, high fashion.",
"Dáng 5: Tay trên ve áo. Ultra realistic fashion editorial portrait of a beautiful young Asian woman. She wears a sophisticated, brown, double-breasted blazer with a pattern of gold Louis Vuitton monogram prints, gold buttons, and a small gold brooch on the lapel, over a matching top. She wears black leather gloves and small gold earrings. Her dark brown hair is in a high, messy bun. One hand is elegantly placed on the lapel of her blazer. She has a slight, confident smile. Plain white studio background. Professional, even, shadowless lighting. 8K UHD, high fashion."
]
},
{
id: 'modern-black-blazer',
name: 'Vest Đen Hiện Đại',
category: 'Fashion & Phong Cách',
numPortraits: 1,
prompts: [
"Dáng 1: Kéo nhẹ vạt áo. Ultra realistic fashion editorial portrait of a stylish Asian woman. She wears a black deep V-neck blazer, open at the bottom, over a matching black top with midriff cut-outs and a black pencil skirt. Accessorized with two delicate gold necklaces and small gold drop earrings. Dark brown hair is in a neat, messy bun. Hands are positioned just below her bust, slightly pulling at the blazer edges, with a confident expression. Solid, muted teal studio background. Professional, soft lighting. 8K UHD, high fashion.",
"Dáng 2: Nhìn thẳng. Ultra realistic fashion editorial portrait of a stylish Asian woman. She wears a black deep V-neck blazer, matching black cut-out top, and black pencil skirt, with delicate gold necklaces and earrings. Dark brown hair in a messy bun. She stands confidently, one hand resting on her hip, looking directly at the camera with a powerful gaze. Solid, muted teal studio background. Professional, soft lighting. 8K UHD, high fashion.",
"Dáng 3: Ngồi trên ghế. Ultra realistic fashion editorial portrait of a stylish Asian woman. She wears a black deep V-neck blazer, matching black cut-out top, and black pencil skirt, with delicate gold necklaces and earrings. Dark brown hair in a messy bun. She is sitting on a modern minimalist stool, legs crossed, looking thoughtfully to the side. Solid, muted teal studio background. Professional, soft lighting creating subtle shadows. 8K UHD, high fashion.",
"Dáng 4: Chân dung cận. Ultra realistic close-up beauty portrait of a stylish Asian woman. She wears a black deep V-neck blazer and delicate gold necklaces. Dark brown hair is in a messy bun with loose strands framing her face. Focus is on her subtle, elegant makeup with soft pink lipstick. She looks at the camera with a serene expression. Solid, muted teal studio background. Professional, soft lighting. 8K UHD, high fashion.",
"Dáng 5: Chuyển động. Ultra realistic fashion editorial portrait of a stylish Asian woman. She wears a black deep V-neck blazer, matching black cut-out top, and black pencil skirt, with delicate gold necklaces and earrings. Dark brown hair in a messy bun. She is captured in a slight walking motion, turning towards the camera with a confident smile. The blazer flows slightly. Solid, muted teal studio background. Professional, soft lighting. 8K UHD, high fashion."
]
},
{
id: 'white-chanel-blazer',
name: 'Blazer Trắng Chanel',
category: 'Fashion & Phong Cách',
numPortraits: 1,
prompts: [
"Dáng 1: Kéo ve áo. Ultra realistic fashion editorial portrait of a chic young woman. She wears a white tailored long-sleeve blazer with a black rose pin on the lapel, an unbuttoned white shirt, white high-waisted shorts, and a black belt with a gold 'CHANEL' buckle. She's accessorized with multiple gold necklaces (one with a cross pendant) and several rings. Her straight, shoulder-length dark brown hair is sleek. Her pose is confident, with both hands gently pulling on the blazer's lapels as she looks at the camera. Plain, light grey studio background. Soft, even, professional lighting. 8K UHD, high fashion, minimalist aesthetic.",
"Dáng 2: Nhìn qua vai. Ultra realistic fashion editorial portrait of a chic young woman in a white tailored blazer with a black rose pin, white shirt, and white shorts, accessorized with gold necklaces and a Chanel belt. She looks over her shoulder at the camera with a confident, modern gaze. Plain, light grey studio background. Soft, even, professional lighting. 8K UHD, high fashion.",
"Dáng 3: Ngồi trên ghế cao. Ultra realistic fashion editorial portrait of a chic young woman in a white tailored blazer with a black rose pin, white shirt, and white shorts, accessorized with gold necklaces and a Chanel belt. She is sitting elegantly on a high minimalist stool, one leg crossed over the other, exuding sophistication. Plain, light grey studio background. Soft, even, professional lighting. 8K UHD, high fashion.",
"Dáng 4: Chân dung cận. Ultra realistic close-up beauty portrait of a chic young woman. Focus on her meticulous makeup with soft pink blush and pink lipstick, and the details of her gold necklaces, cross pendant, and the black rose pin on her white blazer. She has a serene, confident expression. Plain, light grey studio background. Soft, even, professional lighting. 8K UHD, high fashion.",
"Dáng 5: Toàn thân. Ultra realistic full-body fashion editorial portrait of a chic young woman. She stands confidently, showcasing the entire outfit: white tailored blazer with a black rose pin, white shirt, white high-waisted shorts, and the black Chanel belt. She might have one hand in her pocket. Plain, light grey studio background. Soft, even, professional lighting. 8K UHD, high fashion."
]
},
{
id: 'elegant-womens-suit',
name: 'Suit Nữ Thanh Lịch',
category: 'Fashion & Phong Cách',
numPortraits: 1,
prompts: [
"Dáng 1: Tay trong túi. Ultra realistic fashion editorial portrait of a chic young woman. She wears a formal, three-piece black suit: a double-breasted black blazer with satin lapels, a black waistcoat, matching black trousers, a white dress shirt, and a black tie. Her dark brown hair is in a slightly messy updo. Her right hand is casually in her blazer pocket, and she has a neutral, confident expression looking at the camera. Plain, light gray studio background. Soft, professional lighting. 8K UHD, high fashion.",
"Dáng 2: Nhìn qua vai. Ultra realistic fashion editorial portrait of a chic young woman in a formal, three-piece black suit with a white shirt and tie. She looks over her shoulder at the camera with a confident, modern gaze. Plain, light gray studio background. Soft, professional lighting. 8K UHD, high fashion.",
"Dáng 3: Ngồi trên ghế. Ultra realistic fashion editorial portrait of a chic young woman in a formal, three-piece black suit. She is sitting elegantly on a minimalist dark leather armchair, one arm resting on the armrest, exuding sophistication and power. Plain, light gray studio background. Soft, professional lighting. 8K UHD, high fashion.",
"Dáng 4: Chân dung cận. Ultra realistic close-up beauty portrait of a chic young woman. Focus on her natural, light makeup, the texture of the suit's satin lapels, and the subtle pattern on the black tie. She has a serene, confident expression. Plain, light gray studio background. Soft, professional lighting. 8K UHD, high fashion.",
"Dáng 5: Chỉnh sửa cà vạt. Ultra realistic fashion editorial portrait of a chic young woman in a formal, three-piece black suit. She stands confidently, both hands adjusting the knot of her black tie, looking directly at the camera with a slight, knowing smile. Plain, light gray studio background. Soft, professional lighting. 8K UHD, high fashion."
]
}
];


// Transform it to the structure the app uses
const concepts: Concept[] = promptSets.map(set => {
    const poses: Pose[] = set.prompts.map((prompt, index) => {
        // Attempt to parse a name like "Dáng 1: ..."
        const match = prompt.match(/^(Dáng \d+:?)\s*(.*)/);
        if (match) {
            return {
                id: `${set.id}-p${index}`,
                name: match[1].replace(':', ''),
                prompt: prompt,
            };
        }
        // Fallback to generic naming
        return {
            id: `${set.id}-p${index}`,
            name: `Dáng ${index + 1}`,
            prompt: prompt,
        };
    });

    // Replace [face] with [face1] for consistency
    const updatedPrompts = set.prompts.map(p => p.replace(/\[face\]/g, '[face1]'));

    return {
        ...set,
        prompts: updatedPrompts,
        poses: poses.map(p => ({ ...p, prompt: p.prompt.replace(/\[face\]/g, '[face1]') })),
        requiredPortraits: set.numPortraits || 1,
        maxPortraits: set.numPortraits,
    };
});

// Group by category
const categoriesMap: { [key: string]: Concept[] } = concepts.reduce((acc, concept) => {
    const categoryName = concept.category;
    if (!acc[categoryName]) {
        acc[categoryName] = [];
    }
    acc[categoryName].push(concept);
    return acc;
}, {} as { [key: string]: Concept[] });

export const conceptCategories: ConceptCategory[] = Object.entries(categoriesMap).map(([categoryName, concepts]) => ({
    id: categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    name: categoryName,
    concepts: concepts,
}));
