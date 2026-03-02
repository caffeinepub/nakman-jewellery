import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import { useAllBlogPosts, useBlogPostById } from "../hooks/useQueries";

const SAMPLE_POSTS = [
  {
    id: "sample-1",
    title: "5 Trending Imitation Jewellery Styles for 2026",
    author: "NakMan Team",
    content:
      "The imitation jewellery industry is booming with new trends every season. In 2026, we're seeing a massive surge in demand for oxidized silver pieces, kundan sets with colourful stones, and lightweight gold-toned earrings perfect for everyday wear.\n\nFor online sellers on Amazon and Meesho, the top-performing categories continue to be jhumka earrings in both gold and silver tones, bridal sets with AD stones, and anklets for the festival season.\n\nRetailers in tier-2 and tier-3 cities are reporting strong demand for traditional designs — specifically long necklace sets, Kadli bangles, and gents bracelets.\n\nAt NakMan Jewellery, we update our collection every 30 days to keep pace with trends from the major fashion weeks and online seller data. Our team sources inspiration from Delhi's Sadar Bazaar and Jaipur's wholesale markets to bring you designs that actually sell.",
    createdAt: BigInt(Date.now() * 1_000_000),
    coverImage: {
      getDirectURL: () =>
        "/assets/generated/nakman-hero-banner.dim_1400x600.jpg",
    },
  },
  {
    id: "sample-2",
    title: "How to Start Selling Imitation Jewellery on Meesho",
    author: "Malabar Enterprise",
    content:
      "Meesho has become one of the most lucrative platforms for imitation jewellery sellers in India. With millions of active buyers and low platform fees, it's ideal for first-time resellers.\n\nHere's how to get started:\n\n1. Register as a Meesho supplier at supplier.meesho.com\n2. Source quality products from wholesale suppliers like NakMan Jewellery (minimum 6 pcs per design)\n3. Take clean, well-lit photographs of each product\n4. Price competitively — typically 2.5x to 3x your purchase price\n5. Use keywords like 'gold-toned', 'oxidized', 'AD stone' in your listings\n\nNakMan Jewellery offers special pricing for online sellers. Our products are photographed against clean backgrounds and shipped in bubble wrap to minimize damage.\n\nContact us on WhatsApp at +91 93279 99188 to discuss your requirements.",
    createdAt: BigInt((Date.now() - 7 * 24 * 60 * 60 * 1000) * 1_000_000),
    coverImage: {
      getDirectURL: () => "/assets/generated/category-earrings.dim_400x400.jpg",
    },
  },
  {
    id: "sample-3",
    title: "Understanding Wholesale MOQ: Why Minimum Orders Matter",
    author: "NakMan Team",
    content:
      "Many new buyers wonder why wholesale suppliers like NakMan Jewellery have a minimum order quantity (MOQ) of 6 pieces per design. Here's the business reality:\n\nImitation jewellery is manufactured in batches. Each batch requires raw material procurement, labour for setting stones, polishing, and quality checking. When we sell in single pieces, the per-unit cost of handling, packaging, and logistics makes it unviable.\n\nAt 6 pieces, our pricing stays competitive and you get genuine wholesale rates. As you scale up to 50, 100, or 200 pieces of a single design, we reward your commitment with bulk discounts of 10%, 12%, and 15% respectively.\n\nFor new sellers, we recommend starting with 6 pieces of 10-15 designs — this gives you variety without over-investing. You'll quickly learn which designs sell fastest in your market.",
    createdAt: BigInt((Date.now() - 14 * 24 * 60 * 60 * 1000) * 1_000_000),
    coverImage: {
      getDirectURL: () => "/assets/generated/category-bangles.dim_400x400.jpg",
    },
  },
];

export function Blog() {
  const { data: backendPosts, isLoading } = useAllBlogPosts();
  const posts =
    backendPosts && backendPosts.length > 0 ? backendPosts : SAMPLE_POSTS;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Blog & <span className="gold-text-gradient">News</span>
        </h1>
        <p className="text-muted-foreground">
          Jewellery trends, wholesale tips & business insights
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <div key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="aspect-video" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gold/30 rounded-xl">
          <BookOpen className="h-12 w-12 text-gold/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const date = new Date(Number(post.createdAt) / 1_000_000);
            const coverUrl =
              typeof post.coverImage === "object" &&
              "getDirectURL" in post.coverImage
                ? post.coverImage.getDirectURL()
                : "";

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card border border-gold/20 rounded-xl overflow-hidden hover:border-gold/50 hover:shadow-gold-sm transition-all"
              >
                <Link to="/blog/$id" params={{ id: post.id }}>
                  <div className="aspect-video overflow-hidden bg-muted">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gold/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="font-heading font-semibold text-base leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="mt-3 text-xs text-gold font-medium">
                      Read more →
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BlogDetail() {
  const { id } = useParams({ from: "/layout/blog/$id" });
  const { data: backendPost, isLoading } = useBlogPostById(id);

  const samplePost = SAMPLE_POSTS.find((p) => p.id === id);
  const post = backendPost || samplePost;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="aspect-video w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <BookOpen className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Post Not Found</h2>
        <Link
          to="/blog"
          className="text-gold hover:underline mt-2 inline-block"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const date = new Date(Number(post.createdAt) / 1_000_000);
  const coverUrl =
    typeof post.coverImage === "object" && "getDirectURL" in post.coverImage
      ? post.coverImage.getDirectURL()
      : "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold mb-6 transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Blog
      </Link>

      {coverUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-video rounded-xl overflow-hidden mb-6 border border-gold/20"
        >
          <img
            src={coverUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-gold/20">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <Badge
            variant="outline"
            className="border-gold/30 text-gold/80 text-xs"
          >
            NakMan Blog
          </Badge>
        </div>

        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed">
          {post.content.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: static content
              <br key={i} />
            ),
          )}
        </div>
      </motion.article>
    </div>
  );
}
